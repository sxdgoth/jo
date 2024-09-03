class NotificationManager {
    constructor() {
        this.container = document.createElement('div');
        this.container.id = 'notification-container';
        this.container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            max-width: 300px;
            z-index: 9999;
        `;
        document.body.appendChild(this.container);
    }

    show(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            background-color: #f8f8f8;
            color: #333;
            padding: 12px 20px;
            margin-bottom: 10px;
            border-radius: 4px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
        `;

        if (type === 'success') {
            notification.style.borderLeft = '4px solid #4CAF50';
        } else if (type === 'error') {
            notification.style.borderLeft = '4px solid #F44336';
        } else {
            notification.style.borderLeft = '4px solid #2196F3';
        }

        this.container.appendChild(notification);

        // Trigger reflow to enable transition
        notification.offsetHeight;
        notification.style.opacity = '1';

        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                this.container.removeChild(notification);
            }, 300);
        }, duration);
    }
}

// Create a global instance of NotificationManager
window.notificationManager = new NotificationManager();
