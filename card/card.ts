import * as THREE from 'three';

export const getCardMesh = (anisotropy: number) => {
    const frontTexture = new THREE.TextureLoader().load( "/image.png" );
    frontTexture.anisotropy = anisotropy;
    const maskTexture = new THREE.TextureLoader().load( "/mask.png" );
    maskTexture.anisotropy = anisotropy;
    const maskInvTexture = new THREE.TextureLoader().load( "/mask2.png" );
    maskInvTexture.anisotropy = anisotropy;
    const backTexture = new THREE.TextureLoader().load( "/back.png" );
    backTexture.anisotropy = anisotropy;

    const geometry = new THREE.PlaneGeometry( 1, 0.573, 20, 20 );

    const frontMaterialMetallic = new THREE.MeshPhongMaterial( { map: frontTexture, side: THREE.FrontSide } );
    frontMaterialMetallic.shininess = 100;
    frontMaterialMetallic.specular = new THREE.Color(0x777777);
    frontMaterialMetallic.alphaMap = maskTexture
    frontMaterialMetallic.transparent = true

    const frontMaterialPaper = new THREE.MeshPhongMaterial( { map: frontTexture, side: THREE.FrontSide } );
    frontMaterialPaper.shininess = 20;
    frontMaterialPaper.specular = new THREE.Color(0x777777);
    frontMaterialPaper.alphaMap = maskInvTexture
    frontMaterialPaper.transparent = true

    const backMaterial = new THREE.MeshPhongMaterial( { map: backTexture, side: THREE.FrontSide } );
    backMaterial.shininess = 100;
    backMaterial.specular = new THREE.Color(0x777777);

    const frontMesh = new THREE.Mesh( geometry, frontMaterialMetallic );
    const frontMesh2 = new THREE.Mesh( geometry, frontMaterialPaper );
    const backMesh = new THREE.Mesh( geometry, backMaterial );

    backMesh.setRotationFromEuler(new THREE.Euler(0, Math.PI, 0));

    const group = new THREE.Group();
    group.add(frontMesh, frontMesh2, backMesh);

    return group;
}