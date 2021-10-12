const crypto = require('crypto');

export interface Token{
    token: Buffer,
    iv: string
}

export const KeyManager = (() => {
    var algorithm;
    var server_key;
    var oath = "HiddenWatermarkProj"

    const genKey = new Promise<string[]>((res, rej) => {
        try{
            server_key = crypto.randomBytes(32);
            algorithm = 'aes-256-cbc';
            res(server_key);
        } catch (err){
            rej(err);
        }
    });

    const decrypt = (token, iv): Buffer => {
        
        let decipher = crypto.createDecipheriv(algorithm, server_key, iv);
        let decrypted = decipher.update(token, 'hex', 'utf8');
        return decrypted += decipher.final();
    }

    const encrypt = (token): Token => {
        let iv = crypto.randomBytes(16);
        let cipher = crypto.createCipheriv(algorithm, server_key, iv);
        let encrypted = cipher.update(token, 'utf8', 'hex');
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

    const genToken = () : Token => {
        let token = {
            oath: oath,
            timestamp: Date.toString()
        }
        return encrypt(JSON.stringify(token));
    }

    
    return {
        genKey,
        decrypt,
        encrypt,
        getServerKey,
        oath,
        genToken
    }
    
})();
