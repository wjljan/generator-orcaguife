import {validateHostname, validateIpv4, validateIpv4Segment, validateFsName, validatePathname, validatePassword, validateNotZeroInteger, validatePathRelevance, validateIEOrEdgeBrowser} from 'Services';

describe('Validation service', () => {
    it('Validate not zero integer', () => {
        validateNotZeroInteger(0);
        validateNotZeroInteger(123);
    });

    it('Validate hostname', () => {
        validateHostname('');
        validateHostname('orcadt');
    });

    it('Validate IPv4', () => {
        validateIpv4('');
        validateIpv4('192.168.100.1');
    });
    
    it('Validate IPv4 segment', () => {
        validateIpv4Segment('');
        validateIpv4Segment('255.255.255.254');
    });

    it('Validate path relevance', () => {
        validatePathRelevance('', '');
        validatePathRelevance('/a', '/a');
        validatePathRelevance('/', '');
        validatePathRelevance('/', '/a');
        validatePathRelevance('/a', '/b');
        validatePathRelevance('/a', '/');
        validatePathRelevance('/a/b', '/');
        validatePathRelevance('/a/b', '/a/c');
        validatePathRelevance('/a/b', '/a/b/c');
        validatePathRelevance('/a/b', '/a/c/d');
        validatePathRelevance('/k/j', '/a/c/d');
        validatePathRelevance('/a/b', '/a/c');
        validatePathRelevance('/a/b/c', '/a/b');
        validatePathRelevance('/a/c/d', '/a/b');
        validatePathRelevance('/a/c/d', '/k/j');
    });

    it('Validate IE or Edge series browser', () => {
        validateIEOrEdgeBrowser();
        global.ActiveXObject = {};
        validateIEOrEdgeBrowser();
        // reset
        global.ActiveXObject = null;
        Object.defineProperty(global.navigator, 'userAgent', {
            get: function(){return 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36 Edge/17.17134'}
        });
        validateIEOrEdgeBrowser();
    });

    it('Validate fs name', () => {
        validateFsName('');
        validateFsName('abcdsf123');
    });

    it('Validate password', () => {
        validatePassword();
        validatePassword('adminadmin');
    });

    it('Validate pathname', () => {
        validatePathname();
        validatePathname('ddfdsfds');
    });
});