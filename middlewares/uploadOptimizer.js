const sharp = require('sharp');
const { StatusCodes } = require('http-status-codes');
const path = require('path');
const fs = require('fs');

// Middleware pour optimiser les images avant d'envoyer à la requete
const optimizeEventImage = async (req, res, next) => {
  if (!req.files) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Aucune image à optimiser' });
  }

  const file = req.files.image;
  const tempFilePath = file.tempFilePath;
  const optimizedFileName = `optimized_${file.name}`;
  const optimizedFilePath = path.join(
    __dirname,
    '../uploads',
    optimizedFileName
  );
  // on optimise l'image
  try {
    await sharp(tempFilePath)
      // l'image sera formatter en jpg de taille 600x400 avec une qualité de 80%
      .resize(600, 400)
      .jpeg({ quality: 80 })
      .toFile(optimizedFilePath);
    // remplace l'image d'origine

    // Mise à jour de req.files pour refléter le fichier optimisé
    req.files.image = {
      ...file,
      tempFilePath: optimizedFilePath,
      name: optimizedFileName,
    };
    // Suppression du fichier temporaire original
    fs.unlink(tempFilePath, (err) => {
      if (err)
        console.error(
          'Erreur lors de la suppression du fichier temporaire:',
          err
        );
    });

    next();
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Erreur lors de l'optimisation de l'image" });
  }
};

module.exports = { optimizeEventImage };
