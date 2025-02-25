import * as dotenv from 'dotenv';
import {cleanEnv,port,str} from 'envalid';

dotenv.config();

const env = cleanEnv(process.env,{
    ENV: str({choices:['local','production'],default:'local'}),
    PORT: port({default:5000}),
    MONGO_CONNECTION_STRING: str({
        default: 'mongodb+srv://sayuj8086:vsKvmAi2wIYtLsEV@cluster0.keoen.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
    }),
    JWT_SECRET_KEY: str({
        default:'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlyhuiQuiuyi4iLCJlbWFpbCI6ImFkbWluQGVtYy5jb20ifQ.xCyQt3wQXRj8NojG-m26LS9GktX90VBxU15BoxLuTS8'

    }),
    ADMIN_EMAIL: str({default:'admin@gmail.com'}),
    ADMIN_PASSWORD: str({default:'admin'}),
    JWT_EXPIRES: str({default:'7 days'}),
    USER_JWT_SECRET_KEY: str({
        default:'eyJhbGciOiJIUaaaaaaaazI1NiJ9.eyJSb2xlyhuiQuiuyi4iLCJlbWFpbCI6ImFkbWluQGVtYy5jb20ifQ.xCyQt3wQXRj8NojG-m26LS9GktX90VBxU15BoxLuTS8'

    }),
    STRIPE_SECRET_KEY:str({
        default:'sk_test_51QwHUJBLTTX7o2lgsUg8buQEAWvmYSpcv4IQYLc6jZE3RS84SZzBWFlaiPaeacfnlmgt59zHq7NhhRioEeRvJRAC006Xa2WPvv'
    }),
});
export default env;