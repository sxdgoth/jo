class NotificationManager {
    constructor() {
        this.container = document.createElement('div');
        this.container.id = 'notification-container';
        this.container.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            max-width: 300px;
            z-index: 9999;
        `;
        document.body.appendChild(this.container);
    }

    show(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            background-color: #fff;
            color: #333;
            padding: 15px 20px;
            margin-top: 10px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s ease-in-out;
            font-family: 'Arial', sans-serif;
            font-size: 14px;
            display: flex;
            align-items: center;
            overflow: hidden;
        `;

        // Add icon based on notification type
        const icon = document.createElement('span');
        icon.style.cssText = `
            font-size: 20px;
            margin-right: 10px;
        `;
        if (type === 'success') {
            icon.innerHTML = '✅';
            notification.style.borderLeft = '4px solid #4CAF50';
        } else if (type === 'error') {
            icon.innerHTML = '❌';
            notification.style.borderLeft = '4px solid #F44336';
        } else {
            icon.innerHTML = 'ℹ️';
            notification.style.borderLeft = '4px solid #2196F3';
        }

        notification.appendChild(icon);
        notification.appendChild(document.createTextNode(message));

        this.container.appendChild(notification);

        // Trigger reflow to enable transition
        notification.offsetHeight;
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(20px)';
            setTimeout(() => {
                this.container.removeChild(notification);
            }, 300);
        }, duration);
    }
}

// Create a global instance of NotificationManager
window.notificationManager = new NotificationManager();
