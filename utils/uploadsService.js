const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const optimizeEventImage = async (image) => {
  if (!image) {
    throw new Error('Aucune image n a été envoyée');
  }

  const file = image;
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
      .jpeg({ quality: 100 })
      .toFile(optimizedFilePath);

    // Mise à jour de image pour refléter le fichier optimisé
    image = {
      ...file,
      tempFilePath: optimizedFilePath,
      name: optimizedFileName,
    };
    // Suppression du fichier temporaire original
    fs.unlink(tempFilePath, (err) => {
      if (err) {
        throw new Error('Erreur lors de la suppression du fichier temporaire');
      }
    });

    return image;
  } catch (error) {
    throw new Error('Erreur lors de l optimisation de l image');
  }
};

module.exports = { optimizeEventImage };
