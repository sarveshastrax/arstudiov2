import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// S3 Configuration
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
});

const upload = multer({ storage: multer.memoryStorage() });

// --- Auth Routes ---

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role, avatarUrl: user.avatarUrl } });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

app.post('/api/auth/setup', async (req, res) => {
  // Only allowed if no users exist
  const count = await prisma.user.count();
  if (count > 0) return res.status(403).json({ error: 'Setup already completed' });

  const { email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name: 'Super Admin',
      role: 'ADMIN'
    }
  });
  
  const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET || 'secret');
  res.json({ token, user });
});

// Middleware for protected routes
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });
  
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.userId = payload.userId;
    next();
  } catch (e) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// --- Project Routes ---

app.get('/api/projects', authenticate, async (req, res) => {
  const projects = await prisma.project.findMany({
    where: { userId: req.userId },
    orderBy: { updatedAt: 'desc' }
  });
  res.json(projects);
});

app.post('/api/projects', authenticate, async (req, res) => {
  const project = await prisma.project.create({
    data: {
      name: 'Untitled Project',
      slug: `untitled-${Date.now()}`,
      userId: req.userId,
      status: 'DRAFT',
      visibility: 'PRIVATE'
    }
  });
  res.json(project);
});

app.get('/api/projects/:id', authenticate, async (req, res) => {
  const project = await prisma.project.findUnique({
    where: { id: req.params.id },
    include: { sceneObjects: true }
  });
  if (!project) return res.status(404).json({ error: 'Project not found' });
  
  // Transform DB objects to Frontend format
  const formattedObjects = project.sceneObjects.map(obj => ({
    id: obj.id,
    name: obj.name,
    type: obj.type,
    primitiveType: obj.primitiveType,
    assetId: obj.assetId,
    content: obj.content,
    fontSize: obj.fontSize,
    position: { x: obj.posX, y: obj.posY, z: obj.posZ },
    rotation: { x: obj.rotX, y: obj.rotY, z: obj.rotZ },
    scale: { x: obj.scaleX, y: obj.scaleY, z: obj.scaleZ },
    color: obj.color,
    visible: obj.visible,
    videoProps: {
      loop: obj.videoLoop,
      autoplay: obj.videoAuto,
      chromaKey: obj.chromaKey,
      chromaColor: obj.chromaColor,
      threshold: obj.threshold
    },
    audioProps: {
      loop: obj.audioLoop,
      autoplay: obj.audioAuto,
      volume: obj.audioVol
    }
  }));

  res.json({ ...project, sceneObjects: formattedObjects });
});

app.put('/api/projects/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const { geoLocation, ...data } = req.body;
  
  const updateData = { ...data };
  if (geoLocation) {
    updateData.geoLat = geoLocation.lat;
    updateData.geoLng = geoLocation.lng;
  }

  const project = await prisma.project.update({
    where: { id },
    data: updateData
  });
  res.json(project);
});

// --- Scene Object Routes ---

app.post('/api/projects/:id/objects', authenticate, async (req, res) => {
  const { id } = req.params;
  const obj = req.body;
  
  const newObj = await prisma.sceneObject.create({
    data: {
      projectId: id,
      name: obj.name,
      type: obj.type,
      primitiveType: obj.primitiveType,
      assetId: obj.assetId,
      content: obj.content,
      fontSize: obj.fontSize,
      posX: obj.position.x, posY: obj.position.y, posZ: obj.position.z,
      rotX: obj.rotation.x, rotY: obj.rotation.y, rotZ: obj.rotation.z,
      scaleX: obj.scale.x, scaleY: obj.scale.y, scaleZ: obj.scale.z,
      color: obj.color,
      visible: obj.visible,
      // Video
      videoLoop: obj.videoProps?.loop,
      videoAuto: obj.videoProps?.autoplay,
      chromaKey: obj.videoProps?.chromaKey,
      chromaColor: obj.videoProps?.chromaColor,
      threshold: obj.videoProps?.threshold,
      // Audio
      audioLoop: obj.audioProps?.loop,
      audioAuto: obj.audioProps?.autoplay,
      audioVol: obj.audioProps?.volume
    }
  });
  res.json(newObj);
});

app.put('/api/objects/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const data = {};

  if (updates.position) {
    data.posX = updates.position.x; data.posY = updates.position.y; data.posZ = updates.position.z;
  }
  if (updates.rotation) {
    data.rotX = updates.rotation.x; data.rotY = updates.rotation.y; data.rotZ = updates.rotation.z;
  }
  if (updates.scale) {
    data.scaleX = updates.scale.x; data.scaleY = updates.scale.y; data.scaleZ = updates.scale.z;
  }
  if (updates.videoProps) {
    data.videoLoop = updates.videoProps.loop;
    data.videoAuto = updates.videoProps.autoplay;
    data.chromaKey = updates.videoProps.chromaKey;
    data.chromaColor = updates.videoProps.chromaColor;
    data.threshold = updates.videoProps.threshold;
  }
  if (updates.audioProps) {
    data.audioLoop = updates.audioProps.loop;
    data.audioAuto = updates.audioProps.autoplay;
    data.audioVol = updates.audioProps.volume;
  }
  if (updates.name) data.name = updates.name;
  if (updates.content) data.content = updates.content;
  if (updates.color) data.color = updates.color;
  if (updates.visible !== undefined) data.visible = updates.visible;

  const updated = await prisma.sceneObject.update({
    where: { id },
    data
  });
  res.json(updated);
});

app.delete('/api/objects/:id', authenticate, async (req, res) => {
  await prisma.sceneObject.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

// --- Asset Routes ---

app.post('/api/assets', authenticate, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const key = `assets/${Date.now()}-${req.file.originalname}`;
  
  // Upload to S3
  try {
    await s3.send(new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
      ACL: 'public-read'
    }));

    const url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    
    let type = 'IMAGE';
    if (req.file.mimetype.includes('video')) type = 'VIDEO';
    if (req.file.mimetype.includes('audio')) type = 'AUDIO';
    if (req.file.originalname.endsWith('.glb') || req.file.originalname.endsWith('.gltf')) type = 'MODEL';

    const asset = await prisma.asset.create({
      data: {
        name: req.file.originalname,
        type: type,
        url: url,
        key: key,
        size: (req.file.size / 1024 / 1024).toFixed(2) + ' MB'
      }
    });

    res.json(asset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed', details: err.message });
  }
});

app.get('/api/assets', authenticate, async (req, res) => {
  const assets = await prisma.asset.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(assets);
});

// --- Serve Frontend ---
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
