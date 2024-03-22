import fs from 'fs';
import path from 'path';
import mime from 'mime-types';
import { NextApiRequest, NextApiResponse } from 'next';

export default function downloadHandler(req,res) {
    const filename = req.query.filename;
    const filepath = req.query.filepath;
//   const filePath = path.join('C:\Users\Asus\Desktop\thesis project\bla\public', filename); // Replace with the actual path to your file
 

  const contentType = mime.lookup(filename) || 'application/octet-stream';

  // Set the appropriate headers for the file download
    res.setHeader('Content-Disposition', `attachment; filename="${filename}`);
  res.setHeader('Content-Type', contentType);

  // Read the file and send it as the response
  const fileStream = fs.createReadStream(filepath);
  fileStream.pipe(res);
}