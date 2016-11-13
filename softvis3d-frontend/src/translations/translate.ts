import * as i18next from "i18next";

i18next.init({
    lng: "en",
    resources: {
        en: {
            translation: {
                key: "hello world"
            }
        }
    }
});

export default i18next;