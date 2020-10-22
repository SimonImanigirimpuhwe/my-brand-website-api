import bcrypt from 'bcryptjs';
import hashedPass from '../../../src/helpers/hashPass';


describe('Hash Password', () => {
    it('should hash password', async (done) => {
        const password = 'anyvalidpassword';
        const hashedPswd = await hashedPass(password);
        const verifiedPass = await bcrypt.compare(password, hashedPswd);

        expect(verifiedPass).toBeTruthy();

        done()
    });
});