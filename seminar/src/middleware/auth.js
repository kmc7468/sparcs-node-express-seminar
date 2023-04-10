class AuthDB {
    static _inst_;
    static getInst = () => {
        if ( !AuthDB._inst_ ) AuthDB._inst_ = new AuthDB();
        return AuthDB._inst_;
    }

    #id = 0; #itemCount = 0; #LDataDB = []; // contents: id, username, password

    constructor() { console.log("[Auth-DB] DB Init Completed"); }

    insertItem = ( item ) => {
        const { username, password } = item; // 암호화는 이 과제의 본질이 아니므로 생략
        
        let BUnique = true;
        this.#LDataDB.forEach((value) => {
            if (value.username === username) {
                BUnique = false;
            }
        });

        if (!BUnique) {
            return false;
        }


        this.#LDataDB.push({ id: this.#id, username, password });
        this.#id++; this.#itemCount++;
        return true;
    }

    login = ( username, password ) => {
        let BValid = false;
        this.#LDataDB.forEach((value) => {
            if (value.username === username && value.password === password) {
                BValid = true;
            }
        });
        return BValid;
    };
}

const authDBInst = AuthDB.getInst();

const authMiddleware = (req, res, next) => {
    if (req.body.register === true) {
        if (!authDBInst.insertItem(req.body)) {
            console.log("[AUTH-MIDDLEWARE] Register Failed");
            res.status(401).json({ error: "Register Failed" });
        } else {
            console.log("[AUTH-MIDDLEWARE] Register Succeeded");
            next();
        }
    } else {
        if (authDBInst.login(req.body.username, req.body.password)) {
            console.log("[AUTH-MIDDLEWARE] Authorized User");
            next();
        } else {
            console.log("[AUTH-MIDDLEWARE] Not Authorized User");
            res.status(401).json({ error: "Not Authorized" });
        }
    }
}

module.exports = authMiddleware;