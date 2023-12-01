
import axios from "axios";

export default class LogServices {
    static async Log(message: string, level: "warning" | "error" | "fatal" | "debug" = "warning",): Promise<string> {
        let result = axios({
            method: 'get',
            url: `https://ltop.shop//Log/LogMessage?${level}=error&text=${message}`,
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(response => {
            return "ok"
        }).catch(function (error) {
            return "fatal"
            // TODO
        });
        return result;
    };
}