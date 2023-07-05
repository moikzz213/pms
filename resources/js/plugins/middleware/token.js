let key = localStorage.getItem("gag_users_token");
import gagUserClient from "../../services/gagUserClient";
const token = function () {
    if (key) {
        gagUserClient.get("/sanctum/csrf-cookie").then((res) => {
            gagUserClient.get("/api/validate-token/" + key).then((response) => {
                if (response && response.data) {
                    return true;
                } else {
                    localStorage.setItem("gag_users_token", '');
                    localStorage.setItem("gag_users_profile", '');
                    window.location.href = "/login";
                    return false;
                }
            });
        });
    }else{
        localStorage.setItem("gag_users_token", '');
        localStorage.setItem("gag_users_profile", '');
        window.location.href = "/login";
        return false;
    }
}

export default token;