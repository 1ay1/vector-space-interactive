/* 37_pca.js — base course */
'use strict';
(function(){
const cPCA={id:'pca',part:'Part XI · SVD & PCA',title:'PCA — the directions your data actually uses',
  sub:'Data clouds have a shape. PCA finds the few directions that capture most of the variation — the eigenvectors of the covariance — letting you compress high-D data to its essence.',
render(root){
  head(root,0,cPCA);
  root.append(p('Most real data lives near a <em>low-dimensional</em> shape inside its high-dimensional space — a stretched cloud. <span class="term">Principal Component Analysis</span> finds the directions of greatest spread (the long axes of the cloud). Rotate and stretch the cloud; watch the main axis track it.'));
  const L=lab('Find the principal direction','See','see');L.append(pcaCloud());root.append(L);
  root.append(box('aha-box','PCA is eigenvectors of the covariance','The cloud\'s spread is captured by a <b>covariance matrix</b>. Its <em>eigenvectors</em> are the cloud\'s natural axes; the <em>eigenvalues</em> say how much variation lies along each. Keep the top few, drop the rest — you\'ve compressed the data while losing almost nothing. Eigenvectors (Part IX) come back as data science.'));
  root.append(box('key','where PCA runs the world','Face recognition (“eigenfaces”), recommendation systems, gene-expression analysis, noise reduction, and the “embeddings” visualisations you\'ve seen — all use PCA to squeeze many dimensions down to the few that matter.'));
  root.append(quiz({question:'What are the principal components of a dataset?',
    options:[{t:'The eigenvectors of its covariance — the directions of greatest variation',ok:true,why:'Exactly. Top eigenvector = direction of most spread; its eigenvalue = how much.'},
      {t:'The average of all the data points',ok:false,why:'That\'s just the center. PCA is about the directions of spread around the center.'}]}));
  root.append(summary(['Data clouds have a shape; PCA finds their main axes.','Those axes = eigenvectors of the covariance matrix.','Keep the top few → compress high-D data with little loss.','Powers eigenfaces, recommendations, denoising.']));
}};

register(cPCA);
})();
