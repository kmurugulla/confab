// Too add more providers, please send pull requests. Make sure to be descriptive.
/* eslint-disable import/prefer-default-export */
/* eslint-disable prefer-destructuring */
const CDN_PROVIDER = [
  ['.clients.turbobytes.net', 'TurboBytes'],
  ['.turbobytes-cdn.com', 'TurboBytes'],
  ['.afxcdn.net', 'afxcdn.net'],
  ['.akamai.net', 'Akamai'],
  ['.akamaiedge.net', 'Akamai'],
  ['.akadns.net', 'Akamai'],
  ['.akamaitechnologies.com', 'Akamai'],
  ['.gslb.tbcache.com', 'Alimama'],
  ['.cloudfront.net', 'Amazon Cloudfront'],
  ['.anankecdn.com.br', 'Ananke'],
  ['.att-dsa.net', 'AT&T'],
  ['.azioncdn.net', 'Azion'],
  ['.belugacdn.com', 'BelugaCDN'],
  ['.bluehatnetwork.com', 'Blue Hat Network'],
  ['.systemcdn.net', 'EdgeCast'],
  ['.cachefly.net', 'Cachefly'],
  ['.cdn77.net', 'CDN77'],
  ['.cdn77.org', 'CDN77'],
  ['.panthercdn.com', 'CDNetworks'],
  ['.cdngc.net', 'CDNetworks'],
  ['.gccdn.net', 'CDNetworks'],
  ['.gccdn.cn', 'CDNetworks'],
  ['.cdnify.io', 'CDNify'],
  ['.ccgslb.com', 'ChinaCache'],
  ['.ccgslb.net', 'ChinaCache'],
  ['.c3cache.net', 'ChinaCache'],
  ['.chinacache.net', 'ChinaCache'],
  ['.c3cdn.net', 'ChinaCache'],
  ['.lxdns.com', 'ChinaNetCenter'],
  ['.speedcdns.com', 'QUANTIL/ChinaNetCenter'],
  ['.cloudflare.com', 'Cloudflare'],
  ['.cloudflare.net', 'Cloudflare'],
  ['.edgecastcdn.net', 'EdgeCast'],
  ['.adn.', 'EdgeCast'],
  ['.wac.', 'EdgeCast'],
  ['.wpc.', 'EdgeCast'],
  ['.fastly.net', 'Fastly'],
  ['.fastlylb.net', 'Fastly'],
  ['.google.', 'Google'],
  ['googlesyndication.', 'Google'],
  ['youtube.', 'Google'],
  ['.googleusercontent.com', 'Google'],
  ['.l.doubleclick.net', 'Google'],
  ['.hiberniacdn.com', 'Hibernia'],
  ['.hwcdn.net', 'Highwinds'],
  ['.incapdns.net', 'Incapsula'],
  ['.inscname.net', 'Instartlogic'],
  ['.insnw.net', 'Instartlogic'],
  ['.internapcdn.net', 'Internap'],
  ['.kxcdn.com', 'KeyCDN'],
  ['.lswcdn.net', 'LeaseWeb CDN'],
  ['.footprint.net', 'Level3'],
  ['.llnwd.net', 'Limelight'],
  ['.lldns.net', 'Limelight'],
  ['.netdna-cdn.com', 'MaxCDN'],
  ['.netdna-ssl.com', 'MaxCDN'],
  ['.netdna.com', 'MaxCDN'],
  ['.mncdn.com', 'Medianova'],
  ['.instacontent.net', 'Mirror Image'],
  ['.mirror-image.net', 'Mirror Image'],
  ['.cap-mii.net', 'Mirror Image'],
  ['.rncdn1.com', 'Reflected Networks'],
  ['.simplecdn.net', 'Simple CDN'],
  ['.swiftcdn1.com', 'SwiftCDN'],
  ['.swiftserve.com', 'SwiftServe'],
  ['.gslb.taobao.com', 'Taobao'],
  ['.cdn.bitgravity.com', 'Tata communications'],
  ['.cdn.telefonica.com', 'Telefonica'],
  ['.vo.msecnd.net', 'Windows Azure'],
  ['.ay1.b.yahoo.com', 'Yahoo'],
  ['.yimg.', 'Yahoo'],
  ['.zenedge.net', 'Zenedge'],
  ['.azureedge.net', 'Azure CDN'],
];

export function guesscdnbycname(item) {
  let cdn = null;
  let i;
  const cname = Array.isArray(item) ? String(item[0]) : String(item);
  for (i = 0; i < CDN_PROVIDER.length; i += 1) {
    /* eslint-disable-next-line prefer-destructuring */
    if (cname.indexOf(CDN_PROVIDER[i][0]) !== -1) {
      cdn = CDN_PROVIDER[i][1];
      break;
    }
  }
  return cdn;
}
