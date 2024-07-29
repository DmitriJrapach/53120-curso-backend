import multer from 'multer';
import path from 'path';
import fs from 'fs';
import __dirname from './constantsUtil.js';

// Crear las carpetas si no existen
let counter = 1;

const createFolders = () => {
    const folders = ['profiles', 'products', 'documents'];
    folders.forEach(folder => {
        const folderPath = path.join(__dirname, '../../public/img', folder);
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }
    });
};

createFolders();

const storage = multer.diskStorage({
    destination: (_req, file, cb) => {
        if (file.fieldname === 'profileImage') {
            cb(null, path.join(__dirname, '../../public/img/profiles'));
        } else if (file.fieldname === 'productImage') {
            cb(null, path.join(__dirname, '../../public/img/products'));
        } else if (file.fieldname === 'idDocument') {
            cb(null, path.join(__dirname, '../../public/img/documents'));
        } else if (file.fieldname === 'addressDocument') {
            cb(null, path.join(__dirname, '../../public/img/documents'));
        } else if (file.fieldname === 'statementDocument') {
            cb(null, path.join(__dirname, '../../public/img/documents'));
        }
    },
    filename: (_req, file, cb) => {
        const extension = file.originalname.split('.').pop();
        const newFilename = `${file.fieldname}_${counter}.${extension}`;
        counter++;
        cb(null, newFilename);
    }
});

const fileFilter = (_req, file, cb) => {
    const allowedImageTypes = ['image/jpeg', 'image/png'];
    const allowedDocumentTypes = ['application/pdf', 'text/plain'];
    
    if (file.fieldname === 'profileImage' || file.fieldname === 'productImage') {
        if (allowedImageTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only PNG and JPEG are allowed for profileImage and productImage.'));
        }
    } else if (file.fieldname === 'idDocument' || file.fieldname === 'addressDocument' || file.fieldname === 'statementDocument') {
        if (allowedDocumentTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only PDF and text files are allowed for documents.'));
        }
    }
};

const upload = multer({ storage, fileFilter });

export const uploadFields = [
    { name: 'profileImage', maxCount: 1 },
    { name: 'productImage', maxCount: 1 },
    { name: 'idDocument', maxCount: 1 },
    { name: 'addressDocument', maxCount: 1 },
    { name: 'statementDocument', maxCount: 1 }
];

export default upload;
