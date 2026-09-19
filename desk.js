import * as THREE from './three.module.js';

export function mountDesk(host){
 const stage=host.querySelector('.desk-stage'),canvas=host.querySelector('canvas'),status=host.querySelector('.desk-status');
 let renderer;try{renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});}catch{status.textContent='3D view unavailable. Use the links below to explore.';host.classList.add('desk-fallback');return ()=>{};}
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.setClearColor(0xfbe2ef,0);
 const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(36,1,.1,100);const target=new THREE.Vector3(0,1.6,0);const base=new THREE.Vector3(6.9,7.4,10.3);camera.position.copy(base);camera.lookAt(target);
 scene.add(new THREE.HemisphereLight(0xfff4f8,0xb88c9f,2));const sun=new THREE.DirectionalLight(0xfff9e9,2);sun.position.set(-4,9,5);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-8,right:8,top:8,bottom:-8});sun.shadow.bias=-.0005;scene.add(sun);
 const materials=new Map();const mat=c=>{if(!materials.has(c))materials.set(c,new THREE.MeshStandardMaterial({color:c,roughness:.86}));return materials.get(c);};
 const pink=0xf1afcc,light=0xffd7e8,green=0xcbdc9d,ink=0x68625f,cream=0xfff8ed;
 const objects=[],interactive=[];const geometries=new Set();
 function box(parent,w,h,d,x,y,z,color,edges=false){const g=new THREE.BoxGeometry(w,h,d);geometries.add(g);const m=new THREE.Mesh(g,mat(color));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);if(edges){const eg=new THREE.EdgesGeometry(g);geometries.add(eg);m.add(new THREE.LineSegments(eg,new THREE.LineBasicMaterial({color:0x967b87,transparent:true,opacity:.5})));}return m;}
 function cylinder(parent,r1,r2,h,x,y,z,color){const g=new THREE.CylinderGeometry(r1,r2,h,24);geometries.add(g);const m=new THREE.Mesh(g,mat(color));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
 function item(id,x,y,z){const group=new THREE.Group();group.position.set(x,y,z);group.userData.id=id;scene.add(group);objects.push(group);interactive.push(group);return group;}
 const desk=new THREE.Group();scene.add(desk);box(desk,8,.24,4.7,0,1.7,0,light,true);box(desk,7.7,.09,4.4,0,1.56,0,pink);for(const x of [-3.45,3.45])for(const z of [-1.85,1.85])cylinder(desk,.12,.09,1.6,x,.74,z,pink);
 // A soft floor receives real-time shadows beneath the desk.
 const floor=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.ShadowMaterial({opacity:.12}));floor.rotation.x=-Math.PI/2;floor.position.y=-.06;floor.receiveShadow=true;scene.add(floor);
 // Laptop: functional profile entry point, with a real photo on its screen.
 const laptop=item('laptop',-.35,1.9,-.55);laptop.rotation.y=-.10;
 box(laptop,2.6,.12,1.75,0,.02,0,pink,true);box(laptop,.62,.015,.33,0,.091,.57,light,true);
 for(let r=0;r<4;r++)for(let c=0;c<11;c++)box(laptop,.18,.035,.16,-1.06+c*.211,.102,-.58+r*.195,r===0?green:cream);
 box(laptop,1.05,.035,.12,0,.102,.24,cream);
 const lid=new THREE.Group();lid.position.set(0,.13,-.80);lid.rotation.x=-.12;laptop.add(lid);box(lid,2.6,1.7,.11,0,.82,0,pink,true);box(lid,2.35,1.43,.018,0,.84,.07,0xfdf5f8);
 const photoGeometry=new THREE.PlaneGeometry(1.32,1.32);geometries.add(photoGeometry);let alive=true;const texture=new THREE.TextureLoader().load('./milana.png',()=>{if(alive)renderer.render(scene,camera);});texture.colorSpace=THREE.SRGBColorSpace;const photo=new THREE.Mesh(photoGeometry,new THREE.MeshBasicMaterial({map:texture}));photo.position.set(0,.85,.084);lid.add(photo);cylinder(lid,.025,.025,.02,0,1.61,.03,ink).rotation.x=Math.PI/2;
 // Sketchbook and pencils open the actual art collection.
 const sketch=item('art',-2.7,1.87,.5);sketch.rotation.y=.15;box(sketch,1.55,.10,1.85,0,0,0,green,true);box(sketch,1.38,.075,1.68,.045,.075,0,cream);for(let i=0;i<7;i++)cylinder(sketch,.035,.035,.20,-.68,.08,-.64+i*.21,ink).rotation.z=Math.PI/2;
 // Simple wireframe sculpture mounted on the sketchbook signals 3D work.
 const wireGeo=new THREE.IcosahedronGeometry(.37,0);geometries.add(wireGeo);const wire=new THREE.Mesh(wireGeo,new THREE.MeshStandardMaterial({color:0x93ac6d,wireframe:true}));wire.position.set(.05,.43,0);sketch.add(wire);
 const cup=item('crafts',-2.65,2,-1.45);cylinder(cup,.28,.24,.58,0,.15,0,green);for(let i=0;i<6;i++){const pen=new THREE.Group();pen.position.set((i%3-.9)*.12,.40,Math.floor(i/3)*.14-.08);pen.rotation.z=(i-2)*.07;cup.add(pen);cylinder(pen,.027,.027,.75,0,.2,0,i%2?pink:cream);cylinder(pen,.042,.014,.15,0,.65,0,ink);}
 // Fairy Runner is represented by a handheld device, not a fabricated project photo.
 const game=item('fairy',2.15,1.94,.70);game.rotation.y=-.20;box(game,1.05,.16,1.66,0,0,0,pink,true);box(game,.83,.025,.95,0,.095,-.16,green,true);box(game,.31,.025,.11,-.23,.105,.56,cream);box(game,.11,.025,.31,-.23,.105,.56,cream);cylinder(game,.075,.075,.028,.27,.11,.55,cream);cylinder(game,.055,.055,.028,.4,.11,.4,cream);
 // Raised pixels on the small screen keep the illustration simple and tactile.
 for(const [x,z] of [[-.22,.13],[-.08,-.03],[.06,-.18],[.20,-.31]])box(game,.1,.035,.1,x,.12,z,0x7c9458);
 const resume=item('experience',1.75,1.91,-1.3);resume.rotation.y=-.15;box(resume,1.55,.08,1.20,0,0,0,0xeab1cb,true);box(resume,1.40,.018,1.04,.02,.05,.02,cream);for(let i=0;i<4;i++)box(resume,i===0?.5:1,.007,.026,-.13,.065,-.30+i*.18,0xb3bda2);
 // Sewing spool and ribbon accompany the club supplies.
 const spool=item('club',-1.5,1.98,1.5);cylinder(spool,.21,.21,.32,0,0,0,pink);cylinder(spool,.25,.25,.045,0,.18,0,cream);cylinder(spool,.25,.25,.045,0,-.18,0,cream);
 const actions={laptop:()=>openLaptop(),art:()=>navigate('#/art',sketch),crafts:()=>navigate('#/project/crafts-club',cup),club:()=>navigate('#/project/crafts-club',spool),fairy:()=>navigate('#/project/fairy-runner',game),experience:()=>navigate('#/experience',resume)};
 const positions={laptop:new THREE.Vector3(.15,4.3,-.55),art:new THREE.Vector3(-2.7,2.35,.85),crafts:new THREE.Vector3(-3.1,3.1,-1.65),fairy:new THREE.Vector3(2.15,2.15,1.1),experience:new THREE.Vector3(1.75,2.1,-1.6)};
 const labels=[...host.querySelectorAll('[data-object]')];labels.forEach(b=>b.onclick=()=>actions[b.dataset.object]());
 const dialog=host.querySelector('.laptop-dialog');const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;let zoom=0,goalZoom=0,hover=null,pointerX=0,angle=0,startX=null,moved=false,raf,timer;
 function openLaptop(){goalZoom=.65;dialog.showModal();dialog.querySelector('button').focus();}
 dialog.querySelector('.close-laptop').onclick=()=>dialog.close();dialog.addEventListener('close',()=>{goalZoom=0;host.querySelector('[data-object=laptop]').focus();});dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
 function navigate(url,obj){if(reduced){location.hash=url;return;}goalZoom=.2;timer=setTimeout(()=>{if(alive)location.hash=url;},240);}
 host.querySelector('.reset-desk').onclick=()=>{angle=0;pointerX=0;goalZoom=0;};host.querySelector('.rotate-left').onclick=()=>angle=Math.max(-.65,angle-.18);host.querySelector('.rotate-right').onclick=()=>angle=Math.min(.65,angle+.18);
 const ray=new THREE.Raycaster(),pointer=new THREE.Vector2();function hit(e){const rect=canvas.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);ray.setFromCamera(pointer,camera);const hits=ray.intersectObjects(interactive,true);if(!hits.length)return null;let node=hits[0].object;while(node&&!node.userData.id)node=node.parent;return node;}
 const onDown=e=>{startX=e.clientX;moved=false;};const onMove=e=>{if(startX!==null&&e.buttons){const delta=e.clientX-startX;if(Math.abs(delta)>4)moved=true;angle=Math.max(-.65,Math.min(.65,angle+delta*.002));startX=e.clientX;}hover=hit(e);canvas.style.cursor=hover?'pointer':'grab';const rect=canvas.getBoundingClientRect();pointerX=(e.clientX-rect.left)/rect.width-.5;};const onUp=e=>{if(!moved){const obj=hit(e);if(obj)actions[obj.userData.id]();}startX=null;};const onLeave=()=>{hover=null;pointerX=0;startX=null;};canvas.addEventListener('pointerdown',onDown);canvas.addEventListener('pointermove',onMove);canvas.addEventListener('pointerup',onUp);canvas.addEventListener('pointerleave',onLeave);
 const resize=()=>{const w=stage.clientWidth,h=stage.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();};const observer=new ResizeObserver(resize);observer.observe(stage);resize();
 let visible=true;const io=new IntersectionObserver(e=>visible=e[0].isIntersecting);io.observe(stage);
 let lastFrame=0;function tick(now=0){if(!alive)return;raf=requestAnimationFrame(tick);if(!visible||document.hidden||now-lastFrame<33)return;lastFrame=now;zoom+=(goalZoom-zoom)*(reduced?1:.06);const radius=innerWidth<650?17.7:12.2;const a=.48+angle+(reduced?0:pointerX*.045);const pos=new THREE.Vector3(Math.sin(a)*radius,innerWidth<650?11:7.4,Math.cos(a)*radius);pos.lerp(new THREE.Vector3(1,4.6,5),zoom);camera.position.lerp(pos,reduced?1:.08);camera.lookAt(target);for(const obj of objects){const selected=hover===obj;obj.scale.lerp(new THREE.Vector3().setScalar(selected?1.035:1),.14);}renderer.render(scene,camera);for(const b of labels){const v=positions[b.dataset.object].clone().project(camera);b.style.left=`${(v.x*.5+.5)*stage.clientWidth}px`;b.style.top=`${(-v.y*.5+.5)*stage.clientHeight}px`;b.classList.toggle('hovered',hover?.userData.id===b.dataset.object);}}
 tick();status.textContent='Click an object to explore · Drag to turn';host.classList.add('desk-ready');
 return ()=>{alive=false;cancelAnimationFrame(raf);clearTimeout(timer);observer.disconnect();io.disconnect();if(dialog.open)dialog.close();scene.traverse(o=>{o.geometry?.dispose();if(o.material&&!materials.has(o.material.color?.getHex()))o.material.dispose?.();});materials.forEach(m=>m.dispose());texture.dispose();renderer.dispose();};
}
