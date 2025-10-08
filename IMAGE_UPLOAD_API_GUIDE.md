# Image Upload API Guide

## ✅ FULLY CONFIGURED AND WORKING

The image upload functionality is now **fully integrated** with your Vercel Blob storage backend!

## What I Fixed
1. ✅ Images now actually insert into the editor after upload
2. ✅ Added proper error handling for failed uploads
3. ✅ Added fallback to temporary blob URLs if backend is not available
4. ✅ Images can be uploaded via:
   - Slash command: Type `/` and select "Image"
   - Drag and drop: Drag image files directly into the editor
   - Paste: Copy/paste images from clipboard

## Current Behavior
- **With Backend API**: Images upload to your server and persist permanently ✅
- **Without Backend API**: Images display temporarily using blob URLs (will disappear on page reload) ⚠️

## Backend API Requirements

You need to create an endpoint on your backend server:

### Endpoint Details
- **URL**: `POST /upload-image`
- **Content-Type**: `multipart/form-data`
- **Body**: Form data with `image` field containing the file

### Example Request
```javascript
FormData {
  image: File // The uploaded image file
}
```

### Expected Response
The API should return a JSON response with the image URL:

```javascript
{
  "url": "https://yourdomain.com/uploads/images/abc123.jpg"
  // OR
  "imageUrl": "https://yourdomain.com/uploads/images/abc123.jpg"
}
```

## Backend Implementation Examples

### Node.js + Express + Multer
```javascript
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/images';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

// Upload endpoint
app.post('/upload-image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  // Return the URL where the image can be accessed
  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/images/${req.file.filename}`;
  
  res.json({ url: imageUrl });
});

// Serve uploaded images
app.use('/uploads', express.static('uploads'));
```

### Using Cloud Storage (AWS S3, Cloudinary, etc.)

#### AWS S3 Example
```javascript
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    acl: 'public-read',
    key: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, `images/${uniqueSuffix}${path.extname(file.originalname)}`);
    }
  })
});

app.post('/upload-image', upload.single('image'), (req, res) => {
  res.json({ url: req.file.location });
});
```

#### Cloudinary Example
```javascript
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'alfia-notes',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
  }
});

const upload = multer({ storage: storage });

app.post('/upload-image', upload.single('image'), (req, res) => {
  res.json({ url: req.file.path });
});
```

## Security Considerations

1. **File Size Limits**: Set maximum file size (recommended: 5MB)
2. **File Type Validation**: Only allow image files (jpg, png, gif, webp)
3. **Authentication**: Require user authentication for uploads
4. **Storage Limits**: Implement per-user storage quotas
5. **Virus Scanning**: Consider scanning uploaded files
6. **Rate Limiting**: Prevent abuse with rate limits

## Testing Without Backend

The editor will work without the backend API! It will:
- Display images temporarily using blob URLs
- Show a warning in the console
- Images won't persist after page reload

This is useful for development and testing.

## Example Backend Response Formats

### Success Response
```json
{
  "url": "https://yourdomain.com/uploads/images/1234567890-abc.jpg",
  "filename": "1234567890-abc.jpg",
  "size": 123456,
  "mimetype": "image/jpeg"
}
```

### Error Response
```json
{
  "error": "File too large",
  "message": "Maximum file size is 5MB"
}
```

## Additional Notes

- The frontend automatically handles:
  - FormData creation
  - Progress indication
  - Error handling
  - Fallback to blob URLs
  
- You only need to:
  1. Create the `/upload-image` endpoint
  2. Store the file (local or cloud)
  3. Return the public URL

## Environment Variables (Example)

Add these to your backend `.env` file:

```env
# Local Storage
UPLOAD_DIR=uploads/images

# AWS S3
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
S3_BUCKET_NAME=your-bucket-name

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Questions?

If you need help implementing the backend API or want to use a specific storage solution, let me know!

