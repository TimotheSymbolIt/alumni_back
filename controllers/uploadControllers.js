const cloudinary = require('../utils/cloudinaryConfig.js');
const { StatusCodes } = require('http-status-codes');
const fs = require('fs');

postEventImage = async (req, res) => {
  if (!req.files) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: 'Aucune image' });
  }

  const file = req.files.image;
  const filePath = file.tempFilePath;

  // si il y a une image dans la requete
  try {
    // Envoi de l'image à Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
      use_filename: true,
      folder: 'foreach/events',
    });

    // Suppression du fichier optimisé après l'envoi
    fs.unlink(filePath, (err) => {
      if (err)
        console.error(
          'Erreur lors de la suppression du fichier optimisé:',
          err
        );
    });

    res.status(StatusCodes.OK).json({ url: result.secure_url });
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Erreur lors de l'upload de l'image" });
  }
};

module.exports = {
  postEventImage,
};
