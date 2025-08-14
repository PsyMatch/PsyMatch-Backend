# Módulo de Archivos (Files)

## Descripción General

El módulo de **Files** gestiona toda la subida, procesamiento y almacenamiento de archivos en PsyMatch. Utiliza **Cloudinary** como servicio de almacenamiento en la nube para manejar imágenes de perfil, documentos profesionales y otros archivos multimedia con optimización automática, transformaciones y CDN global.

## Funcionalidades Principales

### 📸 Gestión de Imágenes

- **Fotos de perfil**: Subida y optimización automática
- **Compresión inteligente**: Reducción de tamaño manteniendo calidad
- **Transformaciones**: Redimensionamiento, recorte y optimización
- **Formatos múltiples**: JPG, PNG, WEBP, GIF, AVIF

### 📄 Gestión de Documentos

- **Documentos profesionales**: Certificados, matrículas, diplomas
- **Validación de tipos**: Control estricto de formatos permitidos
- **Organización por carpetas**: Estructura jerárquica en Cloudinary
- **Versionado**: Control de versiones de documentos

### 🛡️ Seguridad y Validación

- **Validación de tipos MIME**: Solo archivos permitidos
- **Límites de tamaño**: Control de tamaño máximo por archivo
- **Sanitización**: Limpieza de nombres de archivo
- **Validación opcional**: Archivos opcionales u obligatorios

## Estructura del Módulo

```
files/
├── files.service.ts            # Servicio principal de archivos
├── files.module.ts            # Configuración del módulo
├── interfaces/
│   ├── cloudinary.interface.ts     # Interface para Cloudinary
│   └── file-options.interface.ts   # Opciones de validación
└── pipes/
    └── file-validation.pipe.ts     # Pipe de validación de archivos
```

## Configuración de Cloudinary

### 🔧 Setup de Cloudinary

```typescript
// src/configs/cloudinary.config.ts
import { v2 } from 'cloudinary';
import { envs } from './envs.config';

const cloudinary = {
  provide: 'CLOUDINARY',
  useFactory: () => {
    v2.config({
      cloud_name: envs.cloudinary.cloudName,
      api_key: envs.cloudinary.apiKey,
      api_secret: envs.cloudinary.apiSecret,
    });
    return v2;
  },
};

export default cloudinary;
```

### 🌍 Variables de Entorno

```bash
# .env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 📁 Estructura de Carpetas en Cloudinary

```
PsyMatch/
├── profile_pictures/           # Fotos de perfil de usuarios
│   ├── user_uuid1_timestamp.jpg
│   ├── user_uuid2_timestamp.png
│   └── ...
├── professional_documents/     # Documentos profesionales
│   ├── certificate_uuid_timestamp.pdf
│   ├── license_uuid_timestamp.pdf
│   ├── diploma_uuid_timestamp.pdf
│   └── ...
└── temp/                      # Archivos temporales
    └── ...
```

## API del Servicio de Archivos

### 🔹 `uploadImageToCloudinary` - Subir Imagen de Perfil

**Descripción**: Sube y optimiza una imagen de perfil de usuario.

**Parámetros**:

- `file`: Express.Multer.File - Archivo de imagen
- `userId`: string - UUID del usuario

**Transformaciones aplicadas**:

- Formato automático (WebP cuando es posible)
- Calidad automática optimizada
- Redimensionamiento a 400x400px
- Recorte inteligente con gravedad automática

```typescript
async uploadImageToCloudinary(
  file: Express.Multer.File,
  userId: string,
): Promise<string> {
  return this.uploadToCloudinary(file, userId, 'profile_pictures');
}
```

**Resultado**:

```typescript
// URL optimizada
'https://res.cloudinary.com/your-cloud/image/upload/c_auto,g_auto,q_auto,w_400,h_400/PsyMatch/profile_pictures/user_123456_1673123456789.jpg';
```

### 🔹 `uploadDocumentToCloudinary` - Subir Documento Profesional

**Descripción**: Sube documentos profesionales (certificados, matrículas, diplomas).

**Parámetros**:

- `file`: Express.Multer.File - Archivo de documento
- `userId`: string - UUID del usuario
- `documentType`: 'certificate' | 'license' | 'diploma' | 'other' - Tipo de documento

**Transformaciones aplicadas**:

- Formato automático preservado
- Calidad 90% para documentos
- Sin redimensionamiento (tamaño original)
- Compresión progresiva

```typescript
async uploadDocumentToCloudinary(
  file: Express.Multer.File,
  userId: string,
  documentType: 'certificate' | 'license' | 'diploma' | 'other' = 'other',
): Promise<string> {
  return this.uploadToCloudinary(
    file,
    userId,
    'professional_documents',
    documentType,
  );
}
```

**Resultado**:

```typescript
// URL del documento
'https://res.cloudinary.com/your-cloud/image/upload/f_auto,q_90,fl_progressive/PsyMatch/professional_documents/certificate_123456_1673123456789.pdf';
```

## Validación de Archivos

### 🛡️ FileValidationPipe

Pipe personalizado para validar archivos antes de procesarlos:

```typescript
export class FileValidationPipe implements PipeTransform {
  constructor(private readonly options: IFileOptions = {}) {}

  transform(file?: Express.Multer.File) {
    const {
      maxSizeMB = 2,
      allowPDF = false,
      isOptional = false,
    } = this.options;

    // Validaciones aplicadas:
    // 1. Archivo obligatorio/opcional
    // 2. Tamaño máximo
    // 3. Tipo MIME permitido
    // 4. Formatos específicos según contexto
  }
}
```

### 📋 Opciones de Validación

```typescript
interface IFileOptions {
  maxSizeMB?: number; // Tamaño máximo en MB (default: 2)
  allowPDF?: boolean; // Permitir archivos PDF (default: false)
  isOptional?: boolean; // Archivo opcional (default: false)
}
```

### 🔧 Uso en Controladores

```typescript
// Para fotos de perfil (solo imágenes, 2MB máx, opcional)
@UseInterceptors(FileInterceptor('profile_picture'))
async updateProfile(
  @UploadedFile(new FileValidationPipe({ isOptional: true }))
  profilePicture?: Express.Multer.File,
) {
  // Lógica del controlador
}

// Para documentos profesionales (PDF permitido, 5MB máx, obligatorio)
@UseInterceptors(FileInterceptor('certificate'))
async uploadCertificate(
  @UploadedFile(new FileValidationPipe({
    maxSizeMB: 5,
    allowPDF: true,
    isOptional: false
  }))
  certificate: Express.Multer.File,
) {
  // Lógica del controlador
}
```

## Integración con Frontend (Next.js)

### 🔧 Cliente de Archivos

```typescript
// lib/files.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const filesApi = {
  // Subir foto de perfil
  uploadProfilePicture: async (file: File, token: string) => {
    const formData = new FormData();
    formData.append('profile_picture', file);

    const response = await fetch(`${API_BASE_URL}/users/profile/picture`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error uploading file');
    }

    return response.json();
  },

  // Subir documento profesional
  uploadProfessionalDocument: async (
    file: File,
    documentType: 'certificate' | 'license' | 'diploma',
    token: string,
  ) => {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('type', documentType);

    const response = await fetch(`${API_BASE_URL}/psychologist/documents`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error uploading document');
    }

    return response.json();
  },

  // Validar archivo antes de subir
  validateFile: (
    file: File,
    options: {
      maxSizeMB?: number;
      allowedTypes?: string[];
    } = {},
  ) => {
    const {
      maxSizeMB = 2,
      allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
    } = options;

    // Validar tamaño
    if (file.size > maxSizeMB * 1024 * 1024) {
      throw new Error(`El archivo no debe superar ${maxSizeMB}MB`);
    }

    // Validar tipo
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Tipo de archivo no permitido');
    }

    return true;
  },
};
```

### 📸 Componente de Subida de Imagen

```typescript
// components/ImageUploader.tsx
'use client';

import { useState, useRef } from 'react';
import { filesApi } from '../lib/files';
import { useAuth } from '../context/AuthContext';

interface ImageUploaderProps {
  currentImage?: string;
  onImageUploaded?: (imageUrl: string) => void;
  maxSizeMB?: number;
  className?: string;
}

export default function ImageUploader({
  currentImage,
  onImageUploaded,
  maxSizeMB = 2,
  className = ''
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');

    try {
      // Validar archivo
      filesApi.validateFile(file, {
        maxSizeMB,
        allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
      });

      // Mostrar preview
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      // Subir archivo
      setUploading(true);
      const token = localStorage.getItem('auth_token');

      if (!token) {
        throw new Error('No authenticated');
      }

      const response = await filesApi.uploadProfilePicture(file, token);

      // Limpiar preview temporal
      URL.revokeObjectURL(previewUrl);

      // Usar URL de Cloudinary
      setPreview(response.data.profile_picture);
      onImageUploaded?.(response.data.profile_picture);

    } catch (err: any) {
      setError(err.message);
      setPreview(currentImage || null);
    } finally {
      setUploading(false);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`image-uploader ${className}`}>
      <div className="flex flex-col items-center space-y-4">
        {/* Preview de imagen */}
        <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-200 border-2 border-gray-300">
          {preview ? (
            <img
              src={preview}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-gray-400">
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
          )}

          {uploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          )}
        </div>

        {/* Botón de subida */}
        <button
          onClick={triggerFileSelect}
          disabled={uploading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? 'Subiendo...' : 'Cambiar Foto'}
        </button>

        {/* Input oculto */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Información */}
        <p className="text-sm text-gray-500 text-center">
          JPG, PNG, WEBP o GIF. Máximo {maxSizeMB}MB.
        </p>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-600 text-center">{error}</p>
        )}
      </div>
    </div>
  );
}
```

### 📄 Componente de Subida de Documentos

```typescript
// components/DocumentUploader.tsx
'use client';

import { useState, useRef } from 'react';
import { filesApi } from '../lib/files';

interface DocumentUploaderProps {
  documentType: 'certificate' | 'license' | 'diploma';
  onDocumentUploaded?: (documentUrl: string) => void;
  currentDocument?: string;
}

export default function DocumentUploader({
  documentType,
  onDocumentUploaded,
  currentDocument
}: DocumentUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [uploadedDocument, setUploadedDocument] = useState(currentDocument);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const documentLabels = {
    certificate: 'Certificado',
    license: 'Matrícula',
    diploma: 'Diploma'
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');

    try {
      // Validar archivo
      filesApi.validateFile(file, {
        maxSizeMB: 5,
        allowedTypes: ['application/pdf', 'image/jpeg', 'image/png']
      });

      setUploading(true);
      const token = localStorage.getItem('auth_token');

      if (!token) {
        throw new Error('No authenticated');
      }

      const response = await filesApi.uploadProfessionalDocument(
        file,
        documentType,
        token
      );

      setUploadedDocument(response.data.document_url);
      onDocumentUploaded?.(response.data.document_url);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="document-uploader border-2 border-dashed border-gray-300 rounded-lg p-6">
      <div className="text-center">
        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

        <div className="mt-4">
          <h3 className="text-lg font-medium text-gray-900">
            {documentLabels[documentType]}
          </h3>

          {uploadedDocument ? (
            <div className="mt-2">
              <p className="text-sm text-green-600">✓ Documento subido</p>
              <a
                href={uploadedDocument}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm underline"
              >
                Ver documento
              </a>
            </div>
          ) : (
            <p className="mt-2 text-sm text-gray-600">
              Sube tu {documentLabels[documentType].toLowerCase()}
            </p>
          )}
        </div>

        <div className="mt-6">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {uploading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Subiendo...
              </>
            ) : (
              `Seleccionar ${documentLabels[documentType]}`
            )}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        <p className="mt-2 text-xs text-gray-500">
          PDF, JPG o PNG hasta 5MB
        </p>

        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </div>
    </div>
  );
}
```

### 🖼️ Hook para Gestión de Archivos

```typescript
// hooks/useFileUpload.ts
import { useState } from 'react';
import { filesApi } from '../lib/files';

interface UseFileUploadOptions {
  maxSizeMB?: number;
  allowedTypes?: string[];
  onSuccess?: (url: string) => void;
  onError?: (error: string) => void;
}

export function useFileUpload(options: UseFileUploadOptions = {}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  const uploadFile = async (
    file: File,
    uploadType: 'profile' | 'document',
    documentType?: string,
  ) => {
    setUploading(true);
    setError(null);

    try {
      // Validar archivo
      filesApi.validateFile(file, {
        maxSizeMB: options.maxSizeMB,
        allowedTypes: options.allowedTypes,
      });

      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No authenticated');
      }

      let response;
      if (uploadType === 'profile') {
        response = await filesApi.uploadProfilePicture(file, token);
      } else {
        response = await filesApi.uploadProfessionalDocument(
          file,
          documentType as any,
          token,
        );
      }

      const fileUrl =
        response.data.profile_picture || response.data.document_url;
      setUploadedFile(fileUrl);
      options.onSuccess?.(fileUrl);

      return fileUrl;
    } catch (err: any) {
      const errorMessage = err.message;
      setError(errorMessage);
      options.onError?.(errorMessage);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const resetUpload = () => {
    setUploadedFile(null);
    setError(null);
  };

  return {
    uploading,
    error,
    uploadedFile,
    uploadFile,
    resetUpload,
  };
}
```

## Transformaciones de Cloudinary

### 🎨 Transformaciones para Imágenes de Perfil

```typescript
// URL generada para fotos de perfil
const profileImageUrl = cloudinary.url(publicId, {
  fetch_format: 'auto', // Formato automático (WebP si es compatible)
  quality: 'auto', // Calidad automática optimizada
  crop: 'auto', // Recorte inteligente
  gravity: 'auto', // Punto focal automático
  width: 400, // Ancho fijo 400px
  height: 400, // Alto fijo 400px
});

// Ejemplo de URL resultante:
// https://res.cloudinary.com/demo/image/upload/c_auto,g_auto,q_auto,w_400,h_400/sample.jpg
```

### 📄 Transformaciones para Documentos

```typescript
// URL generada para documentos profesionales
const documentUrl = cloudinary.url(publicId, {
  fetch_format: 'auto', // Preservar formato original
  quality: '90', // Calidad 90% para documentos
  flags: 'progressive', // Carga progresiva
});

// Ejemplo de URL resultante:
// https://res.cloudinary.com/demo/image/upload/f_auto,q_90,fl_progressive/document.pdf
```

### 🔧 Transformaciones Avanzadas

```typescript
// Para diferentes tamaños de perfil
const thumbnailUrl = cloudinary.url(publicId, {
  width: 50,
  height: 50,
  crop: 'fill',
  gravity: 'face', // Enfocar en la cara
});

const mediumUrl = cloudinary.url(publicId, {
  width: 200,
  height: 200,
  crop: 'fill',
  quality: 'auto',
});

// Para documentos con marca de agua
const watermarkedUrl = cloudinary.url(publicId, {
  overlay: 'psymatch_watermark',
  opacity: 30,
  gravity: 'south_east',
});
```

## Optimización y Performance

### ⚡ Configuración de CDN

```typescript
// Configuración optimizada para producción
const optimizedCloudinaryConfig = {
  cloud_name: 'your-cloud',
  secure: true, // Siempre HTTPS
  cdn_subdomain: true, // Usar subdominios CDN
  secure_cdn_subdomain: true,
  private_cdn: false, // CDN público para mejor cache
  sign_url: true, // URLs firmadas para seguridad
  auth_token: {
    key: 'your-auth-key',
    duration: 3600, // Token válido por 1 hora
  },
};
```

### 📊 Métricas de Uso

```typescript
// utils/file-metrics.ts
export class FileMetrics {
  static async getUploadStats() {
    // Estadísticas de subidas por tipo
    const stats = await cloudinary.v2.api.usage();

    return {
      totalStorage: stats.storage.bytes,
      totalImages: stats.storage.images,
      totalVideos: stats.storage.videos,
      bandwidth: stats.bandwidth.bytes,
      transformations: stats.transformations,
    };
  }

  static async getFilesByFolder(folder: string) {
    const result = await cloudinary.v2.search
      .expression(`folder:${folder}`)
      .sort_by([['created_at', 'desc']])
      .max_results(100)
      .execute();

    return result.resources;
  }
}
```

## Seguridad de Archivos

### 🔒 Configuraciones de Seguridad

```typescript
// Configuración segura para uploads
const secureUploadOptions = {
  resource_type: 'auto',
  unique_filename: true,
  overwrite: false,
  invalidate: true, // Invalidar cache CDN
  notification_url: 'https://your-app.com/cloudinary-webhook',
  eager: [
    // Transformaciones inmediatas
    { width: 400, height: 400, crop: 'fill' },
    { width: 100, height: 100, crop: 'thumb' },
  ],
  allowed_formats: ['jpg', 'png', 'webp'],
  max_bytes: 2 * 1024 * 1024, // 2MB máximo
};
```

### 🛡️ Validaciones Adicionales

```typescript
// Validación avanzada de archivos
export class AdvancedFileValidator {
  static async validateImageContent(
    file: Express.Multer.File,
  ): Promise<boolean> {
    // Verificar que realmente es una imagen
    const fileSignature = file.buffer.slice(0, 10);

    // Magic numbers para diferentes formatos
    const signatures = {
      jpg: [0xff, 0xd8, 0xff],
      png: [0x89, 0x50, 0x4e, 0x47],
      gif: [0x47, 0x49, 0x46],
      webp: [0x52, 0x49, 0x46, 0x46],
    };

    // Validar signature
    for (const [format, signature] of Object.entries(signatures)) {
      if (this.matchesSignature(fileSignature, signature)) {
        return true;
      }
    }

    return false;
  }

  private static matchesSignature(
    fileSignature: Buffer,
    expectedSignature: number[],
  ): boolean {
    return expectedSignature.every(
      (byte, index) => fileSignature[index] === byte,
    );
  }
}
```

## Manejo de Errores

### ❌ Errores Comunes

```typescript
// types/file-errors.ts
export enum FileErrorTypes {
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE = 'INVALID_FILE_TYPE',
  UPLOAD_FAILED = 'UPLOAD_FAILED',
  CLOUDINARY_ERROR = 'CLOUDINARY_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
}

export const FileErrorMessages = {
  [FileErrorTypes.FILE_TOO_LARGE]: 'El archivo es demasiado grande',
  [FileErrorTypes.INVALID_FILE_TYPE]: 'Tipo de archivo no permitido',
  [FileErrorTypes.UPLOAD_FAILED]: 'Error al subir el archivo',
  [FileErrorTypes.CLOUDINARY_ERROR]: 'Error del servicio de almacenamiento',
  [FileErrorTypes.NETWORK_ERROR]: 'Error de conexión',
};
```

### 🛠️ Manejo en Frontend

```typescript
// utils/file-error-handler.ts
export const handleFileError = (error: any): string => {
  if (error.message.includes('size')) {
    return FileErrorMessages.FILE_TOO_LARGE;
  } else if (error.message.includes('type')) {
    return FileErrorMessages.INVALID_FILE_TYPE;
  } else if (error.status >= 500) {
    return FileErrorMessages.CLOUDINARY_ERROR;
  } else if (error.message.includes('network')) {
    return FileErrorMessages.NETWORK_ERROR;
  } else {
    return FileErrorMessages.UPLOAD_FAILED;
  }
};
```

## Consideraciones de Producción

### 🚀 Configuración para Producción

```typescript
// Configuración de producción
const productionFileConfig = {
  cloudinary: {
    secure: true,
    sign_url: true,
    auth_token: {
      key: process.env.CLOUDINARY_AUTH_KEY,
      duration: 3600,
    },
  },
  upload: {
    max_file_size: 5 * 1024 * 1024, // 5MB
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'pdf'],
    auto_tagging: 0.8, // Auto-tag con 80% confianza
    categorization: 'google_tagging', // Categorización automática
    detection: 'adv_face', // Detección avanzada de caras
  },
};
```

### 📈 Monitoreo

```typescript
// Monitoreo de uploads
export class FileMonitoring {
  static async logUpload(userId: string, fileType: string, fileSize: number) {
    console.log(`File upload: ${userId} - ${fileType} - ${fileSize} bytes`);

    // Enviar métricas a servicio de monitoring
    // await analytics.track('file_upload', {
    //   userId,
    //   fileType,
    //   fileSize,
    //   timestamp: new Date()
    // });
  }

  static async checkQuota(userId: string): Promise<boolean> {
    // Verificar cuota de usuario
    const usage = await this.getUserUsage(userId);
    const limit = 100 * 1024 * 1024; // 100MB por usuario

    return usage < limit;
  }
}
```

## Próximas Mejoras

- [ ] Compresión automática antes de subir
- [ ] Soporte para videos (para sesiones grabadas)
- [ ] Batch upload para múltiples archivos
- [ ] Integración con análisis de contenido AI
- [ ] Sistema de versioning de archivos
- [ ] Cache local de archivos frecuentes
- [ ] Optimización automática de formatos por dispositivo
- [ ] Backup automático de archivos críticos
- [ ] Watermarking automático para documentos
- [ ] OCR para extracción de texto de documentos
