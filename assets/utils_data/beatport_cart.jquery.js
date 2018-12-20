obinfoarray = [];
jQuery('.cart-tracks .bucket-item.track').each(function(i,elmt){
   let oi = {};

   oi.artworklink = jQuery.trim($(elmt).find('.buk-track-artwork-parent img').attr('src'));
   oi.beatportlink = 'https://www.beatport.com' + jQuery.trim($(elmt).find('.buk-track-title a').attr('href'));
   oi.title = jQuery.trim($(elmt).find('.buk-track-primary-title').text());
   oi.title += ' ('+jQuery.trim($(elmt).find('.buk-track-remixed').text())+')';
   oi.artists = jQuery.trim($(elmt).find('.buk-track-artists').text());
   oi.labels = jQuery.trim($(elmt).find('.buk-track-labels').text());
   oi.release = jQuery.trim($(elmt).find('.buk-track-released').text());

   obinfoarray.push(oi);
});
JSON.stringify({
    datasource:'beatport_cart',
    collection:obinfoarray
}, null, 2);
