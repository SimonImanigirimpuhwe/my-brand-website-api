import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import generateToken from '../../../src/helpers/jwToken';


describe('Generate token', () => {
    it('should return a jwt token', async(done) => {
        const payload = {
            _id: mongoose.Types.ObjectId().toHexString(),
            email: 'validemail@gamil.com',
            name: 'validtname',
            isAdmin: true || false
        };

        const token = await generateToken(payload);
        const decodedToken = await jwt.verify(token, process.env.SECRET_KEY);

        expect(decodedToken).toMatchObject(payload)
        done()
    });

    it('should throw if payload is invalid', (done) => {
        expect(() => generateToken(null).toThrow())
        done()
    });
});