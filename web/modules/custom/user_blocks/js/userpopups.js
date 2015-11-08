Drupal.userpopups = {};

Drupal.behaviors.userpopups = {
  attach: function(context, settings) {
   jQuery('html').once('popups-initialized').each(function(){
      Drupal.userpopups.init();
    });
  }
};

Drupal.userpopups.init = function init(){

  var login_box = jQuery('#block-userlogin');
  var pass_box = jQuery('.user-pass');

  login_box.append('<div class="close">Închide</div>');
  pass_box.append('<div class="close">Închide</div>');


  jQuery('.connect').click(function(e){
    login_box.addClass('active');   
    e.preventDefault();
  });

  jQuery('.item-list li:nth-child(2)').find('a').click(function(e){
    login_box.removeClass('active');
    pass_box.addClass('active');
    e.preventDefault();
  });

  jQuery('.close').click(function(e){
    jQuery(this).parent().removeClass('active');
    e.preventDefault();
  });
};
