import { KeyManager } from "./keygenerator";

export interface Payload{
    userid: string,
    username: string,
    type: string
}

export interface Signature{
    oath: string,
    timestamp: string
}

export interface Token{
    token: string,
    iv: Buffer
}

export interface RawToken{
    payload: Payload,
    sign: Signature
}


export const Jwt = (() => {

    var oath = "HiddenWatermarkProj";

    const setSign = (sign: string) => {
        oath = sign;
    }
    const genToken = (userid: string, username: string, type: string) =>{
        let payload: Payload = {
            userid,
            username,
            type
        };
        let signature: Signature = {
            oath,
            timestamp: Date.now().toString()
        }
        return KeyManager.genToken(payload, signature);
    }

    const verify = (token: Token) => {
        if (token) {
            try{
            let rawToken = KeyManager.decrypt({token: token.token, iv: Buffer.from(token.iv)});
            if (rawToken.sign.oath === oath){
                // Overtime check can be declared here.
                return true;
            }
            }catch(err){
            return false;
            }
        }
        return false;
    }

    const getPayload = (token: Token): Payload | null => {
        if (token) {
            try{
                
                let rawToken = KeyManager.decrypt({token: token.token, iv: Buffer.from(token.iv)});
                return rawToken.payload
            } catch (err){
                console.log(err);
                return null;
            }
        }
        return null;
    }

    return {
        setSign,
        genToken,
        verify,
        getPayload,
        oath
    }
})();