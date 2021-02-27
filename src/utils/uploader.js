import  { cloudinary } from '../../config/cloudinary';

const uploader = (imag) => {
    const uploaded = cloudinary.uploader.upload(imag);
    return uploaded
}

export default uploader;