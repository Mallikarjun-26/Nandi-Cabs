(() => {
  const summaryCache = new Map();
  const creditCache = new Map();
  const api = 'https://en.wikipedia.org/api/rest_v1/page/summary/';
  const pending=[]; let active=0;
  const requestJson=url=>new Promise((resolve,reject)=>{pending.push({url,resolve,reject,attempt:0});pump();});
  function pump(){while(active<3&&pending.length){const task=pending.shift();active++;fetch(task.url).then(response=>{if(response.status===429&&task.attempt<2){task.attempt++;setTimeout(()=>{pending.push(task);pump();},900*task.attempt);return null;}if(!response.ok)throw new Error(`Wikipedia request failed (${response.status})`);return response.json();}).then(value=>{if(value!==null)task.resolve(value);}).catch(task.reject).finally(()=>{active--;pump();});}}
  const shortExtract=text=>{const sentences=(String(text||'').match(/[^.!?]+[.!?]+|[^.!?]+$/g)||[]).slice(0,2).join(' ').trim();return sentences.length>420?`${sentences.slice(0,417).trimEnd()}…`:sentences;};
  const relatedPage=(requested,actual)=>{
    const norm=s=>String(s||'').toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,' ').trim();
    const a=norm(requested),b=norm(actual);if(!a||!b)return false;if(a===b||a.includes(b)||b.includes(a))return true;
    const aa=a.split(' ').filter(x=>x.length>3),bb=new Set(b.split(' ').filter(x=>x.length>3));if(aa.some(x=>bb.has(x)))return true;
    const prev=Array.from({length:b.length+1},(_,i)=>i);for(let i=1;i<=a.length;i++){let diagonal=prev[0];prev[0]=i;for(let j=1;j<=b.length;j++){const above=prev[j];prev[j]=Math.min(prev[j]+1,prev[j-1]+1,diagonal+(a[i-1]===b[j-1]?0:1));diagonal=above;}}
    return 1-prev[b.length]/Math.max(a.length,b.length)>.78;
  };
  const articleUrl = title => `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replaceAll(' ', '_'))}`;
  const summary = title => {
    const key = title.trim();
    if (!summaryCache.has(key)) summaryCache.set(key, requestJson(api + encodeURIComponent(key.replaceAll(' ', '_'))));
    return summaryCache.get(key);
  };
  const plain = html => new DOMParser().parseFromString(html||'','text/html').body.textContent.trim();
  const fileCredit = imageUrl => {
    if (!creditCache.has(imageUrl)) {
      const pathname = new URL(imageUrl).pathname;
      const thumbPath = pathname.split('/thumb/')[1];
      const file = decodeURIComponent(thumbPath ? thumbPath.split('/').slice(2,-1).join('/') : pathname.split('/').pop());
      const q = new URLSearchParams({action:'query',format:'json',origin:'*',prop:'imageinfo',iiprop:'extmetadata',titles:`File:${file}`});
      creditCache.set(imageUrl, requestJson(`https://commons.wikimedia.org/w/api.php?${q}`).then(json=>{
        const page=Object.values(json.query?.pages||{})[0]; const meta=page?.imageinfo?.[0]?.extmetadata||{};
        const artist=plain(meta.Artist?.value||meta.Credit?.value)||'Wikimedia Commons contributor';
        const license=plain(meta.LicenseShortName?.value)||'See file page';
        return {artist:artist.slice(0,110),license,fileUrl:`https://commons.wikimedia.org/wiki/${encodeURIComponent(`File:${file}`).replaceAll('%3A',':')}`};
      }));
    }
    return creditCache.get(imageUrl);
  };
  window.CAB_WIKIPEDIA = { summary, fileCredit, articleUrl, shortExtract, relatedPage };
  const applyPhoto = async (img, title) => {
    try {
      const page=await summary(title); const src=page.thumbnail?.source;
      if (!src) { img.hidden=true; return page; }
      img.src=src; img.hidden=false;
      return page;
    } catch { img.hidden=true; return null; }
  };
  const loadRouteImage=async img=>{
    const source=img.closest('.route-card')?.querySelector('.route-photo-credit');
    const candidates=[...new Set([img.dataset.wikiImage,...(img.dataset.wikiAlternates||'').split('|'),img.dataset.wikiFallback].filter(Boolean))];
    let page=null;
    for(const title of candidates){
      try{
        const result=await summary(title);
        if(!result.thumbnail?.source||!relatedPage(title,result.title))continue;
        const loaded=await new Promise(resolve=>{
          let settled=false;
          const finish=value=>{if(settled)return;settled=true;clearTimeout(timeout);img.onload=null;img.onerror=null;resolve(value);};
          const timeout=setTimeout(()=>finish(false),5000);
          img.onload=()=>finish(true);img.onerror=()=>finish(false);img.hidden=false;img.src=result.thumbnail.source;
        });
        if(loaded){page=result;break;}
      }catch{}
    }
    if(!page){img.hidden=true;if(source)source.textContent='Photo unavailable';return;}
    const routeName=window.CAB_DATA?.routes?.find(item=>item.slug===img.closest('.route-card')?.dataset.routeCard)?.name;
    img.alt=`${page.title} photo for the ${routeName||'Bengaluru'} cab route`;
    if(source){source.href=page.content_urls?.desktop?.page||articleUrl(page.title);source.textContent='View photo source ↗';source.title='Wikipedia image source';}
    try {
      const c=await fileCredit(page.thumbnail.source);
      if(source){source.textContent=`Photo: ${c.artist} · ${c.license}`;source.href=c.fileUrl;source.title='Image credit and license details';}
    }catch{if(source)source.textContent='Photo: Wikimedia Commons';}
  };
  const routeImages=[...document.querySelectorAll('[data-wiki-image]')];
  if('IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){observer.unobserve(entry.target);loadRouteImage(entry.target);}}),{rootMargin:'180px'});
    routeImages.forEach(img=>observer.observe(img));
  }else routeImages.forEach(loadRouteImage);

  const destination=document.querySelector('[data-wiki-destination]');
  if(destination){
    const title=destination.dataset.wikiDestination;
    summary(title).then(async page=>{
      destination.querySelector('.wiki-destination-extract').textContent=shortExtract(page.extract)||page.description||`Read the Wikipedia page for ${title}.`;
      const article=destination.querySelector('.wiki-destination-link');
      article.href=page.content_urls?.desktop?.page||articleUrl(title);
      if(page.thumbnail?.source){
        const img=destination.querySelector('.wiki-destination-photo');img.src=page.thumbnail.source;img.hidden=false;
        try{const c=await fileCredit(page.thumbnail.source);const credit=destination.querySelector('.wiki-destination-credit');credit.textContent=`Photo: ${c.artist} · ${c.license}`;credit.href=c.fileUrl;}
        catch{}
      }
    }).catch(()=>{destination.querySelector('.wiki-destination-extract').textContent='Wikipedia information is unavailable right now.';});
  }

  const grid=document.querySelector('[data-wiki-places]');
  if (!grid) return;
  const route=window.CAB_DATA?.routes?.find(r=>r.slug===grid.dataset.wikiPlaces);
  if (!route) { grid.textContent='Destination details are unavailable.'; return; }
  grid.replaceChildren();
  (route.places||[]).forEach(title=>{
    const card=document.createElement('article'); card.className='attraction-card';
    const img=document.createElement('img'); img.alt=`${title} photo`; img.loading='lazy'; img.hidden=true;
    const body=document.createElement('div'); body.className='attraction-copy';
    const heading=document.createElement('h3'); const link=document.createElement('a'); link.href=articleUrl(title); link.target='_blank'; link.rel='noopener noreferrer'; link.textContent=title; heading.append(link);
    const extract=document.createElement('p'); extract.className='attraction-extract'; extract.textContent='Loading Wikipedia summary…';
    const attribution=document.createElement('a'); attribution.className='attraction-credit'; attribution.target='_blank'; attribution.rel='noopener noreferrer'; attribution.href=articleUrl(title);
    body.append(heading,extract,attribution); card.append(img,body); grid.append(card);
    summary(title).then(async page=>{
      if(page.type==='disambiguation'||!relatedPage(title,page.title)){extract.textContent='No matching Wikipedia summary was found. Open the article for details.';return;}
      extract.textContent=shortExtract(page.extract)||'Read the Wikipedia article for details.';
      link.href=page.content_urls?.desktop?.page||articleUrl(title);
      if (page.thumbnail?.source) {
        img.src=page.thumbnail.source; img.hidden=false;
        try { const c=await fileCredit(page.thumbnail.source); attribution.textContent=`Photo: ${c.artist} · ${c.license}`; attribution.title='Image credit and license details'; attribution.href=c.fileUrl; }
        catch { attribution.textContent='Photo: Wikimedia Commons'; }
      } else attribution.textContent='No article photo available';
    }).catch(()=>{extract.textContent='Wikipedia details could not be loaded. Open the article for more information.'; attribution.textContent='Wikipedia';});
  });
})();
