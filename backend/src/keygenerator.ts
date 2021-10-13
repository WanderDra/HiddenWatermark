const crypto = require('crypto');
import { Payload, Signature, Token, RawToken} from "./jwt";


export const KeyManager = (() => {
    var algorithm: string;
    var server_key: string;

    const genKey = new Promise<string>((res, rej) => {
        try{
            server_key = crypto.randomBytes(32);
            algorithm = 'aes-256-cbc';
            res(server_key);
        } catch (err){
            rej(err);
        }
    });

    const decrypt = (token: Token): RawToken => {
        let decipher = crypto.createDecipheriv(algorithm, server_key, token.iv);
        let decrypted = decipher.update(token.token, 'hex', 'utf8');
        return JSON.parse(decrypted += decipher.final());
    }

    const encrypt = (str: string): Token => {
        let iv = crypto.randomBytes(16);
        let cipher = crypto.createCipheriv(algorithm, server_key, iv);
        let encrypted = cipher.update(str, 'utf8', 'hex');
        return {token: encrypted += cipher.final('hex'), iv: iv};
    }

    const getServerKey = () => {
        if (server_key === ""){
            console.log('Server key is not yet generated!');
            return null;
        }else{
            return server_key;
        }
    }

    const genToken = (payload: Payload, sign: Signature) : Token => {
        let token: RawToken = {
            payload, sign
        }
        return encrypt(JSON.stringify(token));
    }

    
    return {
        genKey,
        decrypt,
        encrypt,
        getServerKey,
        genToken
    }
    
})();
