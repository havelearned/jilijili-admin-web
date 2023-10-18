import {Notify} from 'quasar'

export const useNotify = () => {
    /**
     * 否定通知
     * */
    const negativeNotify = (message) => {
        Notify.create({
            type: "negative",
            message: message,
        })
    }

    /**
     * 成功通知
     * */
    const positiveNotify = (message) => {
        Notify.create({
            type: "positive",
            message: message,
        })
    }

    /**
     * 警告通知
     * */
    const warningNotify = (message) => {
        Notify.create({
            type: "warning",
            message: message,
        })
    }

    /**
     * 消息提示
     * */
    const infoNotify = (message) => {
        Notify.create({
            type: "info",
            message: message,
        })
    }

    /**
     * 自定义通知
     */
    const customNotify = (option) => {
        Notify.create({
            type: option.type,
            message: option.message,
            color: option.color,
            textColor: option.textColor,
            position: option.position,
            multiLine: option.multiLine,
            actions: [
                {
                    label: '前往', color: 'blue', handler: () => { /* ... */
                    }
                },
                {
                    label: '忽略', color: 'grey', handler: () => { /* ... */
                    }
                }
            ]
        })

    }
    return {
        negativeNotify,
        positiveNotify,
        warningNotify,
        infoNotify,
        customNotify
    }

}


