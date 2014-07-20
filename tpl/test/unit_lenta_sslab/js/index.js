/**
 * Created by SyrkovSV on 15.07.14.
 */

$(function()
    {
        $.fn.t.editor = $.fn.editor;
        $.fn.t.modal = $.fn.modal;
        var opt = {};
        $("div.container").t(opt);
    });

(function($)
    {
        $.fn.t = function(options)
            {
                $.fn.t.options = $.extend({}, $.fn.t.defaults, options);

                $.fn.t.modal_tags_list = $("#tags_list");

                $(window).scroll(function () {if ($(this).scrollTop() > 0) {$('#scroller').fadeIn();} else {$('#scroller').fadeOut();}});
                $('#scroller').click(function () {$('body,html').animate({scrollTop: 0}, 400); return false;});

                $('.item .availability').hover(
               		function() {
               			$(this).find('.hint').addClass('show-block');
               		},
               		function() {
               			$(this).find('.hint').hideClass('show-block');
               		});

                $("[rel=tooltip]").tooltip();

                var kc_name_str = $.fn.t.parseGetParams()["kc_name"];
                kc_name_str = (kc_name_str != undefined)?kc_name_str.split(","):[];
                var title = "";
                $.each(kc_name_str,function(k,d)
                    {
                        $.fn.t.kc_name_arr_current.push(decodeURI(d));
                        var a = $("div.text_search_menu").find("a:contains('"+decodeURI(d)+"')");
                        $("h1.center").text(decodeURI(d));
                        window.document.title = decodeURI(d);
                        //a.addClass('tags_list_disabled');
                    });

                /*$("a.tags_list").click(function(e)
                    {
                        e.preventDefault();
                        var k_categories_id = $(this).data("k_categories_id");
                        if($("div.box_filters").find("span.cons[data-k_categories_id='"+k_categories_id+"']").length == 0)
                            {
                                $(this).addClass('tags_list_disabled');
                                $.fn.t.prepare_box_filters(k_categories_id,$(this).text());
                                $.fn.t.prepare_item_filters();
                            }
                    });*/

                /*$("div.box_filters span.clear_all a").click(function(e)
                    {
                        e.preventDefault();
                        $("div.box_filters").find("span.cons").remove();
                        var item = $("li.item");
                        $.each(item,function(k,d)
                            {
                                if($(this).css("display") == "none")
                                    {
                                        $(this).show();
                                    }
                            });
                        $.fn.t.kc_name_arr_current = [];
                        $("span.clear_all").hide();
                        $('a.tags_list').removeClass('tags_list_disabled');
                    });*/

                $("button#btn_subscribe_save").click(function(e)
                    {
                        e.preventDefault();
                        var email = $.trim($("input#subscribe_email").val());
                        if(!$.fn.m.is_email(email))
                            {
                                $.fn.m.modal_confirm.find(".modal_confirm_header").text("Ошибка");
                                $.fn.m.modal_confirm.find(".modal_confirm_block").text("Не корректный адрес электронной почты");
                                $.fn.m.modal_confirm.modal('show');
                                setTimeout(function()
                                    {
                                        $.fn.m.modal_confirm.modal('hide');
                                    }, 2000);
                                return false;
                            }

                        var j_p = {};
                        j_p["fn"] = "ss";
                        if($("button#btn_subscribe_save").hasClass('subscribe'))
                            {
                                j_p["param"] = 1;
                            }
                        else if($("button#btn_subscribe_save").hasClass('unsubscribe'))
                            {
                                j_p["param"] = 0;
                            }
                        j_p["email"] = email;

                        $.fn.t.data = function(){$.fn.t.editor.set_subscribe(j_p); return $.fn.t.editor.data;}();
                        if($.fn.t.data.error != undefined)
                            {
                                $.fn.m.modal_confirm.find(".modal_confirm_header").text("Ошибка");
                                if($("button#btn_subscribe_save").hasClass('subscribe'))
                                    {
                                        $.fn.m.modal_confirm.find(".modal_confirm_block").text("Ошибка при подписке на рассылку с данного сайта");
                                    }
                                else if($("button#btn_subscribe_save").hasClass('unsubscribe'))
                                    {
                                        $.fn.m.modal_confirm.find(".modal_confirm_block").text("Ошибка при отписывании от рассылки с данного сайта");
                                    }
                                $.fn.m.modal_confirm.modal('show');
                                setTimeout(function()
                                    {
                                        $.fn.m.modal_confirm.modal('hide');
                                    }, 2000);
                                return false;
                            }
                        var id = $.fn.t.data.id;
                        var msg = ($.fn.t.data.msg == undefined)?"":$.fn.t.data.msg;
                        var success = $.fn.t.data.success;
                        if(success == 0)
                            {
                                $.fn.m.modal_confirm.find(".modal_confirm_header").text("Ошибка");
                                $.fn.m.modal_confirm.find(".modal_confirm_block").text(msg);
                                $.fn.m.modal_confirm.modal('show');
                                setTimeout(function()
                                    {
                                        $.fn.m.modal_confirm.modal('hide');
                                    }, 2000);
                                return false;
                            }
                        else if(success == 1)
                            {
                                $.fn.m.modal_confirm.find(".modal_confirm_header").text("Уведомление");
                                if($("button#btn_subscribe_save").hasClass('subscribe'))
                                    {
                                        $.fn.m.modal_confirm.find(".modal_confirm_block").text("Вы успешно подписались на рассылку.");
                                    }
                                else if($("button#btn_subscribe_save").hasClass('unsubscribe'))
                                    {
                                        $.fn.m.modal_confirm.find(".modal_confirm_block").text("Вы успешно отписались от рассылки.");
                                    }

                                $.fn.m.modal_confirm.modal('show');
                                setTimeout(function()
                                    {
                                        if($("button#btn_subscribe_save").hasClass('subscribe'))
                                            {
                                                $("button#btn_subscribe_save").addClass("unsubscribe").removeClass("subscribe").text("Отписаться");
                                            }
                                        else if($("button#btn_subscribe_save").hasClass('unsubscribe'))
                                            {
                                                $("button.unsubscribe").addClass("subscribe").removeClass("unsubscribe").text("Подписаться");
                                                $("input#subscribe_email").val('');
                                            }
                                        $.fn.m.modal_confirm.modal('hide');
                                    }, 2000);
                            }
                    });

                $("#btn_unit_more").click(function(e)
                    {
                        e.preventDefault();
                        var json_param = {};
                        json_param['fn'] = 'gu';
                        json_param['kc_name_arr'] = $.fn.t.kc_name_arr_current;
                        json_param['offset'] = $.fn.t.unit_show_cnt;
                        json_param['terms'] = $("div#terms_unit").text();
                        $.ajax(
                            {
                                type: "POST",
                                url: $.fn.editor.url_ajax_set_f,
                                data: json_param,
                                dataType: 'json',
                                async: false,
                                error: function(xhr)
                                    {
                                        $.fn.m.modal_confirm.find(".modal_confirm_header").text("Ошибка");
                                        $.fn.m.modal_confirm.find(".modal_confirm_block").text("Ошибка загрузки товаров");
                                        $.fn.m.modal_confirm.modal('show');
                                        setTimeout(function()
                                            {
                                                $.fn.m.modal_confirm.modal('hide');
                                            }, 2000);
                                        return false;
                                    },
                                success: function(data)
                                    {
                                        if(data.length > 0)
                                            {
                                                $.fn.t.prepare_item(data);
                                                $.fn.t.unit_show_cnt = $.fn.t.unit_show_cnt +36;
                                            }
                                    }
                            });
                    });


                /*$.fn.t.modal_tags_list.on('shown', function()
                    {
                        $('body').modalmanager('loading');
                        $('body').modalmanager('removeLoading');

                        $(this).find("button#btn_tags_list_select").unbind("click").bind("click",function(e)
                            {
                                e.preventDefault();
                                var tags_list = $(this).parents("#tags_list").find(".tags_list_select");
                                var tags_list_arr = [];
                                $.each(tags_list,function(i,d)
                                    {
                                        var checked = this.checked;
                                        if(checked)
                                            {
                                                tags_list_arr.push(parseInt($(this).data("k_categories_id")));
                                            }
                                    });

                                $.each(tags_list_arr,function(i,k_categories_id)
                                    {
                                        if($("div.box_filters").find("span.cons[data-k_categories_id='"+k_categories_id+"']").length == 0)
                                            {
                                                var txt = $("input.tags_list_select[data-k_categories_id='"+k_categories_id+"']");
                                                $('a.tags_list[data-k_categories_id="'+k_categories_id+'"]').addClass('tags_list_disabled');
                                                $.fn.t.prepare_box_filters(k_categories_id,txt.val());
                                                $.fn.t.prepare_item_filters();
                                            }
                                    });
                                $.fn.t.modal_tags_list.modal('hide');
                            });
                    });*/
            }

        $.fn.t.prepare_item = function (in_data)
            {
                $.each(in_data,function(i,d)
                    {
                        var hlisting = $("ul.hlisting");
                        if(d["img_card_primary"] != undefined && d["img_card_primary"][0] != undefined)
                            {
                                var img_card_primary = d["img_card_primary"][0]+'/medium.png';
                            }
                        else
                            {
                                var img_card_primary = $.fn.t.no_image_src;
                            }
                        var str = '' +
                            '<li class="item" data-unit_id="'+d["unit_id"]+'" data-k_brand_id="'+d["k_brand_id"]+'" data-k_essence_id="'+d["k_essence_id"]+'"  data-k_categories_id="'+d["k_categories_id_arr"]+'" data-k_properties_value_id="'+d["k_properties_value_id_arr"]+'">'+
                            '<div class="availability">'+
                                '<span class="in_stock">'+
                            		'<span class="hint">В&nbsp;наличии</span>'+
                                '</span>'+
                            '</div>'+
                            '<div class="item-info">'+
                                '<div class="photo" style="text-align: center;">'+
                                    '<img alt="" src="'+img_card_primary+'">'+
                        		'</div>'+
                            '</div>'+
                            '<div class="darkhover"></div>'+
                            '<div class="detailholder">'+
                            	'<div class="fn">'+d["name_detailed"]+'</div>'+
                            	'<div class="divide20"></div>'+
                            	'<p style="display: none; height: 66px; padding-top: 0px; margin-top: 0px; padding-bottom: 0px; margin-bottom: 0px;" class="description">'+
                                    d["properties_value_arr"]+
                            	'</p>'+
                                '<div class="divide20"></div>'+
                            	'<p></p>'+
                            	'<div class="listing-action leftfloat">'+
                            		'<span class="sell">Цена</span>'+
                            		'<span class="price">'+d["cost"]+' руб</span>'+
                            	'</div>'+
                            	'<div class="sb-clear"></div>'+
                            '</div>'+
                        '</li>';
                        hlisting.append(str);
                    });
            }

        $.fn.t.intersect = function (arr1, arr2) {
            var arr3 = [];
            for(i = 0; i < arr1.length; i++) {
                for(j = 0; j < arr2.length; j++) {
                    if (arr1[i] == arr2[j]) {
                        var is_duplicate = false;
                        for (k = 0; k < arr3.length; k++) {
                            if (arr1[i] == arr3[k]) {
                                is_duplicate = true;
                            }
                        }
                        if (is_duplicate == false) {
                            arr3.push(arr1[i]);
                        }
                    }
                }
            }
            return arr3;
        }

        $.fn.t.parseGetParams = function()
            {
                var $_GET = {};
                var __GET = window.location.search.substring(1).split("&");
                for(var i=0; i<__GET.length; i++)
                    {
                        var getVar = __GET[i].split("=");
                        $_GET[getVar[0]] = typeof(getVar[1])=="undefined" ? "" : getVar[1];
                    }
                return $_GET;
            }

        $.fn.t.parseGetHash = function()
            {
                var $_GET = {};
                var __GET = window.location.hash.substring(1).split("&");
                for(var i=0; i<__GET.length; i++)
                    {
                        var getVar = __GET[i].split("=");
                        $_GET[getVar[0]] = typeof(getVar[1])=="undefined" ? "" : getVar[1];
                    }
                return $_GET;
            }

        $.fn.t.editor = {};
        $.fn.t.modal = {};

        $.fn.t.defaults = {};
        $.fn.t.options = {};

        $.fn.t.users_id_current = 0;
        $.fn.t.unit_id_current = 0;

        $.fn.t.url_home = 0;
        $.fn.t.url_login = 0;
        $.fn.t.url_article_list = 0;
        $.fn.t.url_unit_item = 0;
        $.fn.t.url_unit_list = 0;
        $.fn.t.url_lib = 0;

        $.fn.t.no_image_src = "";

        $.fn.t.kc_name_arr_current = [];

        $.fn.t.modal_tags_list = {};

        $.fn.t.unit_show_cnt = 36;

        $.fn.t.data = {};
    })($);