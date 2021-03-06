//var SectionView = require('./section');
var ReceiptCollection = require('../collections/receipts');

module.exports = ControlView = Backbone.View.extend({

    tagName: 'div',
    template: require('../templates/control'),
    events: {
    	"submit form":"postData",
    	"change input.form-control" : "formChange"
    },

    initialize: function() {
    },

    render: function() {
        this.$el.html(this.template());
        var that = this;
        // async to allow proper refresh.
        setTimeout(function(){
        	that.getData();
        },0);        
    },
    
    getData: function(){
    	$("#loader").show();
    	// asks server for product without infos.
    	var that = this;
    	var productBody = this.$el.find("#products-body");
    	productBody.html("");
    	var productRowTemplate = _.template(this.$el.find("#template-row").html());
    	$.getJSON('invalidProducts', function(data) {
        	productBody.html("");
    		$.each(data, function(key, val) {
    		    if(val.shop_label){
    		      productBody.append(productRowTemplate(val));
    		    } else {
    		      console.log(val);
    		    }
    		});
        	$("#loader").hide();
    	});
    },
    
    postData: function(e){
    	$("#loader").show();
    	e.preventDefault();
    	var formData = $("form").serialize();
    	var productBody = this.$el.find("#products-body");
    	var productRowTemplate = _.template(this.$el.find("#template-row").html());
    	var that = this;
    	
    	$.ajax({
		  type: "POST",
		  url: 'postFoodfacts',
		  data: formData,
		  // dataType: "json",
          beforeSend: function(){$("#modal-overlay").show();},
          complete: function(){$("#modal-overlay").hide();},
		  success: function(data) {
	        // recharge la page.
		    that.getData();
		    // recalcule les stats
	        $.get('buildAllStats');
	      },
		});
    },
    formChange: function(e){
    	var id = e.target.name.split('_')[1];
    	$("[name='changed_"+id+"']").val("true");
    }
    
});

