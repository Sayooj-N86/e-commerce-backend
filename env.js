import * as dotenv from "dotenv";
import {cleanEnv,port,str} from "envalid";

dotenv.config();

const env = cleanEnv(process.env,{
    ENV: str({choices:['local','production'],default:'local'}),
    PORT: port({default:5000}),
    MONGO_CONNECTION_STRING: str({
        default: 'mongodb+srv://sayuj8086:vsKvmAi2wIYtLsEV@cluster0.keoen.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
    })
})
export default env;