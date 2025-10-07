function generateFakeKey(length = 256) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = '';
    for (let i = 0; i < length; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
}

export const services = [
    { name: 'A-LINK', icon: 'red', available: true, url: `https://alink.alfia.com.sa?alf=${generateFakeKey()}` },
    { name: 'FOUNDER BAG', icon: 'blue', available: true, url: `https://founder.alfia.com.sa?alf=${generateFakeKey()}` },
    { name: 'EAAS', icon: 'purple', available: true, url: `https://eaas.alfia.com.sa?alf=${generateFakeKey()}` },
    { name: 'STARTUP', icon: 'blue', available: true, url: `https://startup.alfia.com.sa?alf=${generateFakeKey()}` },
    { name: 'A-BRAIN', icon: 'yellow', available: true, url: `https://abrain.alfia.com.sa?alf=${generateFakeKey()}` },
    { name: 'WORKSPACE', icon: 'yellow', available: true, url: "" },
];

