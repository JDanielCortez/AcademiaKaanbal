(function(api){var ContextMenu=api.ContextMenu={containerClass:'jsn-bootstrap4',container:null,menu:null,context:null,element:null,component:null,modal:null,processing:null,get:function(){if(!this.menu){if(!this.container){this.container=document.createElement('div');this.container.id=api.Text.toId('container',true);if(this.containerClass){this.container.className=this.containerClass;}document.body.appendChild(this.container);}this.menu=ReactDOM.render(React.createElement(api.ElementMenu,{id:api.Text.toId('context-menu',true),type:'dropdown'}),this.container);}this.hide();return this.menu;},show:function(items,context,event,element,component,modal,bounding){this.get();this.context=context;this.element=element;this.component=component;if(modal){this.modal=modal;}var prepareItems=function(contextMenuItems){var visibleItems=[];var lastItemDisabled=false;for(var i=0;i<contextMenuItems.length;i++){var item=JSON.parse(JSON.stringify(contextMenuItems[i])),disabled=false;if(item.condition){for(var j=0;j<item.condition.length;j++){var match=item.condition[j].match(/([!=<>]+)/);if(match){var operator=match[1];var parts=item.condition[j].split(operator);var key=parts[0].trim();var value=context[key]||element.getAttribute('data-'+key);var compare=parts[1].trim();if(typeof value=='string'&&value.match(/^-?\d+$/)){value=parseInt(value);}else if(value==null){value='';}if(compare.match(/^-?\d+$/)){compare=parseInt(compare);}else{compare=compare.replace(/^["'](.*)["']$/,'$1');}switch(operator){case '=':case '==':if(!(value==compare)){disabled=true;}break;case '!=':case '<>':if(!(value!=compare)){disabled=true;}break;case '>':if(!(value>compare)){disabled=true;}break;case '<':if(!(value<compare)){disabled=true;}break;case '>=':if(!(value>=compare)){disabled=true;}break;case '<=':if(!(value<=compare)){disabled=true;}break;}}else{var test=this.executeCallback(item.condition[j]);if(test!==undefined&&!test){disabled=true;}}if(disabled){break;}}}if(!disabled&&item.separator&&lastItemDisabled){disabled=true;}if(disabled){lastItemDisabled=true;}else{if(item.items){item.items=prepareItems(item.items);}else if(item.target){var link=item.url||item.href||item.link;item.link=this.replacePlaceholder(link,context,element);delete item.url;delete item.href;}else if(!item.separator){item.onClick=this.doAction.bind(this,item);}visibleItems.push(item);lastItemDisabled=false;}}return visibleItems;}.bind(this);this.menu.setState({items:prepareItems(items)});this.menu.refs.mountedDOMNode.style.display='block';this.menu.refs.mountedDOMNode.style.visibility='hidden';if(event&&event.clientX&&event.clientY){if(this.menu.refs.mountedDOMNode.style.position!='absolute'){this.menu.refs.mountedDOMNode.style.position='absolute';}if(this.menu.refs.mountedDOMNode.style.zIndex!='9999'){this.menu.refs.mountedDOMNode.style.zIndex='9999';}var scrollTop=document.body.scrollTop||document.documentElement.scrollTop;var scrollLeft=document.body.scrollLeft||document.documentElement.scrollLeft;var top=scrollTop+event.clientY;var left=scrollLeft+event.clientX;if(bounding){var boundingRect=bounding.getBoundingClientRect();top+=boundingRect.top;left+=boundingRect.left;}var clientWidth=(document.documentElement||document.body).clientWidth;var clientHeight=(document.documentElement||document.body).clientHeight;var menuRect=this.menu.refs.mountedDOMNode.getBoundingClientRect();var menuCss=window.getComputedStyle(this.menu.refs.mountedDOMNode);var borderTop=parseInt(menuCss.getPropertyValue('border-top-width'));var borderBottom=parseInt(menuCss.getPropertyValue('border-bottom-width'));if(top+menuRect.height+borderTop+borderBottom>scrollTop+clientHeight){top-=top+menuRect.height+borderTop+borderBottom-(scrollTop+clientHeight);}if(left+menuRect.width>scrollLeft+clientWidth){left-=left+menuRect.width-(scrollLeft+clientWidth);}this.menu.refs.mountedDOMNode.style.top=top+'px';this.menu.refs.mountedDOMNode.style.left=left+'px';this.menu.refs.mountedDOMNode.classList.remove('close-to-right');this.menu.refs.mountedDOMNode.classList.remove('close-to-bottom');var subMenus=this.menu.refs.mountedDOMNode.querySelectorAll('.dropdown-submenu>.dropdown-menu');if(subMenus.length){var farthest=subMenus[subMenus.length-1];farthest.style.display='block';var farthestRect=farthest.getBoundingClientRect();if(farthestRect.top+farthestRect.height+borderTop+borderBottom>scrollTop+clientHeight){this.menu.refs.mountedDOMNode.classList.add('close-to-bottom');}if(farthestRect.left+farthestRect.width>scrollLeft+clientWidth){this.menu.refs.mountedDOMNode.classList.add('close-to-right');}farthest.style.display='';}}this.menu.refs.mountedDOMNode.style.visibility='visible';return this.menu;},hide:function(){if(this.menu){this.menu.refs.mountedDOMNode.style.display='none';}return this.menu;},doAction:function(action,event){event.preventDefault&&event.preventDefault();this.hide();action=this.executeCallback(action.callback,'prepare',action,event,this.context,this.element)||action;var link=action.url||action.href||action.link;if(!link){return;}var doAction=function(){link=this.replacePlaceholder(link,this.context,this.element);if(link==''||link=='#'||link.indexOf('javascript:')>-1){return;}if(action.ajax){this.toggleProcessing();api.Ajax.request(link,function(res){if(action.confirm){var footer=this.modal.refs.mountedDOMNode.querySelector('.modal-footer');for(var i=0;i<footer.children.length;i++){footer.children[i].disabled=false;if(footer.children[i].classList.contains('btn-primary')){footer.children[i].textContent=footer.children[i].origText;delete footer.children[i].origText;}}}var error;var responseText=res.responseText.split('<div id="system-debug" class="profiler">')[0];if(res.responseJSON&&!res.responseJSON.success){error=res.responseJSON.message||res.responseJSON.error||res.responseJSON.data;}else if(responseText.indexOf('<div class="alert alert-error">')>-1){error=responseText;}if(error){if(error.indexOf('<div class="alert alert-error">')>-1){error=error.split('<div class="alert alert-error">')[1];error=error.split('<div class="alert-message">')[1];error=error.split('</div>')[0];}api.Modal.alert(api.Text.parse('<p>'+error+'</p>'));}else{this.executeCallback(action.callback,'update',res,event,this.context,this.element);}if(this.processing){this.toggleProcessing(!error);}}.bind(this),action.post);}else{this.modal=this.modal||api.Modal.get();this.modal.setState({show:true,type:'iframe',title:this.replacePlaceholder(action.modalTitle||action.text,this.context,this.element),content:{src:link,onLoad:this.executeCallback.bind(this,action.onLoad)},buttons:action.modalButtons||[],width:action.modalWidth||'90%',height:action.modalHeight||'90%',confirm:this.submitModal.bind(this,action,event),cancel:this.cancelAction.bind(this,action),showCloseButton:action.modalCloseButton||false});}}.bind(this);if(action.confirm){var message=api.Text.parse(typeof action.confirm=='string'?action.confirm:'are-you-sure',true);message=this.replacePlaceholder(message,this.context,this.element);this.modal=api.Modal.confirm(message,function(modal){var footer=modal.refs.mountedDOMNode.querySelector('.modal-footer');for(var i=0;i<footer.children.length;i++){footer.children[i].disabled=true;if(footer.children[i].classList.contains('btn-primary')){footer.children[i].origText=footer.children[i].textContent;footer.children[i].textContent=api.Text.parse('processing');}}var callback=action.callback;action.callback=function(type,res,event){if(callback=='function'){var result=callback(type,res,event);}if(type=='update'){if(action.successMessage){modal=api.Modal.alert(action.successMessage);if(action.closeModalHandler){modal.setState({onModalHidden:this.executeCallback.bind(this,action.closeModalHandler)});}}else{modal.close();}}return result;}.bind(this);doAction();}.bind(this),null,true);}else{doAction();}},submitModal:function(action,event){if(action.task&&typeof this.modal.refs.iframe.contentWindow[action.task]=='function'){this.toggleProcessing();this.modal.refs.iframe.contentWindow[action.task](function(res){this.toggleProcessing(res.responseJSON&&res.responseJSON.success);if(!res.responseJSON||!res.responseJSON.success){return api.Modal.error(res);}this.executeCallback(action.callback,'update',res,event,this.context,this.element);this.modal.setState({show:false,content:{src:'about:blank'}});}.bind(this));return this.modal.close();}var form=this.modal.refs.iframe.contentWindow.document.querySelector('form');if(!form){return;}var toggleButtonState=function(disable){var buttons=this.modal.refs.mountedDOMNode.querySelectorAll('.modal-footer button');for(var i=0;i<buttons.length;i++){buttons[i].disabled=disable?true:false;if(buttons[i].id.indexOf('confirm')>-1){if(disable){buttons[i].origTextContent=buttons[i].origTextContent||buttons[i].textContent;buttons[i].textContent=api.Text.parse('processing');}else{buttons[i].textContent=buttons[i].origTextContent;}}}}.bind(this),onLoad=function(){api.Event.remove(this.modal.refs.iframe,'load',onLoad);toggleButtonState();var error=this.modal.refs.iframe.contentWindow.document.querySelector('.alert-error .alert-message');this.toggleProcessing(!error);if(error){api.Modal.alert(error.innerHTML);}else{var res=this.modal.refs.iframe.contentWindow.document.getElementsByTagName('html')[0].innerHTML;this.executeCallback(action.callback,'update',res,event,this.context,this.element);this.modal.setState({show:false,content:{src:'about:blank'}});}}.bind(this);toggleButtonState(true);api.Event.add(this.modal.refs.iframe,'load',onLoad);if(!form.getAttribute('action')){form.action=this.modal.refs.iframe.src;}if(form.action.indexOf('tmpl=component')<0){form.action+='&tmpl=component';}var formSubmitted=false;this.modal.refs.iframe.contentWindow.onbeforeunload=function(){formSubmitted=true;this.modal.close();this.toggleProcessing();}.bind(this);if(action.task&&this.modal.refs.iframe.contentWindow.Joomla&&this.modal.refs.iframe.contentWindow.Joomla.submitbutton){try{this.modal.refs.iframe.contentWindow.Joomla.submitbutton(action.task);}catch(e){}}else{form.submit();}setTimeout(function(){if(!formSubmitted){toggleButtonState();api.Event.remove(this.modal.refs.iframe,'load',onLoad);this.modal.refs.iframe.contentWindow.onbeforeunload=null;}}.bind(this),500);},cancelAction:function(action){var form=this.modal.refs.iframe.contentWindow.document.querySelector('form');if(form){if(this.modal.refs.iframe.contentWindow.Joomla&&this.modal.refs.iframe.contentWindow.Joomla.submitbutton){try{if(!form.getAttribute('action')){form.action=this.modal.refs.iframe.src;}if(form.action.indexOf('tmpl=component')<0){form.action+='&tmpl=component';}this.modal.refs.iframe.contentWindow.Joomla.submitbutton(action.task.replace('save','cancel'));}catch(e){}}}setTimeout(function(){this.modal.setState({show:false,content:{src:'about:blank'}});}.bind(this),1000);this.modal.close();},replacePlaceholder:function(text,context,element){var match=text.match(/(\{[^\}]+\})/g);if(match){for(var i=0;i<match.length;i++){var p=match[i].replace(/^\{([^\}]+)\}$/,'$1'),data=context[p]||element.getAttribute('data-'+p);if(data){text=text.replace(match[i],text.match(/^(https?:|\/\/|index\.php)/)?encodeURIComponent(data):data);}}}return text;},toggleProcessing:function(success){if(!this.processing){this.processing=document.createElement('i');this.processing.className='fa fa-circle-o-notch fa-spin float-right';var elmStyle=window.getComputedStyle(this.element),display=elmStyle.getPropertyValue('display');if(display.indexOf('inline')==0){this.element.parentNode.classList.add('clearfix');this.element.parentNode.appendChild(this.processing);}else{this.element.classList.add('clearfix');this.element.appendChild(this.processing);}return;}if(success){this.processing.className=this.processing.className.replace('fa-circle-o-notch fa-spin','fa-check');}this.visibilityTimeout&&clearTimeout(this.visibilityTimeout);this.fadeTimeout&&clearTimeout(this.fadeTimeout);this.visibilityTimeout=setTimeout(function(){this.processing.style.transition='opacity .25s';this.processing.style.opacity=0;this.fadeTimeout=setTimeout(function(){if(this.processing){if(this.processing.origClass){this.processing.className=this.processing.origClass;this.processing.style.opacity=1;delete this.processing.origClass;}else if(this.processing.parentNode){this.processing.parentNode.removeChild(this.processing);}delete this.processing;}}.bind(this),success?250:0);}.bind(this),success?1000:0);},executeCallback:function(callback,task){var cb;if(callback){if(typeof callback=='function'){cb=callback;}else if(typeof this.component[callback]=='function'){cb=this.component[callback];}else if(typeof api[callback]=='function'){cb=api[callback];}else if(typeof window[callback]=='function'){cb=window[callback];}if(cb){cb=cb.apply(null,Array.prototype.slice.call(arguments,1));}}if(task=='update'&&!cb){if(this.component.props.config){this.component.componentWillMount();}else{this.component.forceUpdate();}}return cb;},setContainerClass:function(className){this.containerClass=className;if(this.container){this.container.className=this.containerClass;}}};var Edition=api.Edition={data:{},params:{},callback:{},init:function(params){if(params.textMapping){api.Text.setData(params.textMapping);delete params.textMapping;}if(params.callback){var cb=typeof params.callback=='string'?api.findObject(params.callback):params.callback;this.callback[params.extension]=this.callback[params.extension]||[];if(cb&&this.callback[params.extension].indexOf(cb)<0){this.callback[params.extension].push(cb);}delete params.callback;}for(var p in params){this.params[p]=params[p];}this.getData(this.params.extension);return this;},getLink:function(action){if(!this.params.url){return;}return this.params.url+'&action='+action;},getData:function(extension,cb){extension=extension||this.params.extension;var link=this.getLink('getInfo');api.Ajax.request(link?link+'&component='+extension:link,function(res){if(!res.responseJSON||!res.responseJSON.success){return api.Modal.error(res);}this.data[extension]=res.responseJSON.data;for(var p in res.responseJSON.data){this.data[p]=res.responseJSON.data[p];}if(this.data[extension].token==''){return this.verifyUser(extension);}if(this.callback&&this.callback[extension]){for(var i=0;i<this.callback[extension].length;i++){if(typeof this.callback[extension][i]=='function'){this.callback[extension][i](this.data[extension]);}}}if(typeof cb=='function'){cb();}}.bind(this));},verifyUser:function(extension){extension=extension||this.params.extension;this.verifyUserModal=api.Modal.get({id:'jsn-user-verification-modal',type:'html',width:'550px',title:api.Text.parse('JSN_EXTFW_USER_VERIFICATION_TITLE'),content:React.createElement('div',{className:'verification-content'},React.createElement('div',{className:'alert alert-error',hidden:true}),React.createElement(UserVerification,{id:'jsn-user-verification-form',accounts:this.data[extension]?this.data[extension].accounts:null,forgotUsername:this.params.forgotUsername,forgotPassword:this.params.forgotPassword})),buttons:[{text:api.Text.parse('JSN_EXTFW_USER_VERIFICATION_VERIFY_BUTTON'),className:'btn btn-primary',onClick:this.doVerifyUser.bind(this,extension)},{text:api.Text.parse('JSN_EXTFW_USER_VERIFICATION_CANCEL_AND_LEAVE_BUTTON'),className:'btn btn-default',onClick:function(){api.Modal.hide();if(this.data[extension].token==''){window.history.go(-1);}}.bind(this)}]});},doVerifyUser:function(extension,modal,event){extension=extension||this.params.extension;var button=event.target;button.disabled=true;button.origHTML=button.origHTML||button.innerHTML;button.innerHTML='<i class="fa fa-circle-o-notch fa-spin"></i>';button.origClass=button.origClass||button.className;button.className='btn btn-default disabled';if(button.nextElementSibling){button.nextElementSibling.disabled=true;}var form=modal.refs.mountedDOMNode.querySelector('.verification-content');var account=form.querySelector('[name="account"]:checked');var existing=form.querySelector('[name="existing"]');var username=form.querySelector('[name="username"]');var password=form.querySelector('[name="password"]');var link,data;if(account&&account.value=='existing'){link=this.getLink('copyToken');data={from:existing.options[existing.selectedIndex].value};}else{link=this.getLink('getToken');data={username:username.value,password:password.value};}var alert=form.querySelector('.alert-error');if(alert&&!alert.hidden){alert.hidden=true;modal.forceUpdate();}api.Ajax.request(link+'&component='+extension,function(res){var reset=function(){button.disabled=false;button.innerHTML=button.origHTML;button.className=button.origClass;if(button.nextElementSibling){button.nextElementSibling.disabled=false;}};if(!res.responseJSON||!res.responseJSON.success){reset();if(alert){var error;if(res.responseJSON){error=res.responseJSON.message||res.responseJSON.error||res.responseJSON.data;}else{error=res.responseText;}alert.innerHTML=error;alert.hidden=false;modal.forceUpdate();}}else{this.getData(extension,function(){reset();var license=this.parseLicense(extension),title,content,buttons;if(!license){return api.Modal.get({id:'invalid-license-data-modal',type:'html',title:null,content:'Invalid license data.',buttons:[{text:api.Text.parse('JSN_EXTFW_CLOSE'),className:'btn btn-default',onClick:api.Modal.hide}]});}this.verifyProduct(extension);}.bind(this));}}.bind(this),data);},verifyProduct:function(extension,trial){extension=extension||this.params.extension;var license=this.parseLicense(extension),title,content,buttons;if(api.isCurrentLicenseTrial(extension)&&api.isCurrentLicenseExpired(extension)){return this.tryProFailed();}if(api.isCurrentLicenseFree(extension)){content=React.createElement('div',{className:'verification-content'},React.createElement('p',null,api.Text.parse('JSN_EXTFW_PRODUCT_VERIFICATION_FREE_EDITION')));buttons=[{text:api.Text.parse('JSN_EXTFW_PRODUCT_VERIFICATION_GOT_IT'),className:'btn btn-default',onClick:this.showConfirmTrackingModal.bind(this)}];}if(trial){title=api.Text.parse('JSN_EXTFW_TRIAL_REGISTRATION_DONE_TITLE');content=React.createElement('div',{className:'verification-content'},React.createElement('p',null,api.Text.parse('JSN_EXTFW_TRIAL_REGISTRATION_DONE_MESSAGE')));buttons=[{text:api.Text.parse('JSN_EXTFW_TRIAL_REGISTRATION_DONE_BUTTON'),className:'btn btn-default',onClick:api.Modal.hide}];}api.Modal.get({id:'jsn-product-verification-modal',type:'html',title:title||api.Text.parse('JSN_EXTFW_PRODUCT_VERIFICATION_TITLE'),width:'550px',content:content||React.createElement('div',{className:'verification-content'},React.createElement('p',null,api.Text.parse('JSN_EXTFW_PRODUCT_VERIFICATION_ALL_DONE')),React.createElement('p',null,api.Text.parse('JSN_EXTFW_PRODUCT_VERIFICATION_INTRODUCTION')),React.createElement('ul',null,React.createElement('li',null,api.Text.parse('JSN_EXTFW_PRODUCT_VERIFICATION_EDITION'),' ',React.createElement('strong',null,api.Text.parse(extension.substr(4).toUpperCase()),' '+api.Text.capitalize(license.edition))),React.createElement('li',null,api.Text.parse('JSN_EXTFW_PRODUCT_VERIFICATION_EXPIRATION'),' ',React.createElement('strong',null,api.Text.toReadableDate(license.expiration_date)))),React.createElement('p',null,api.Text.parse('JSN_EXTFW_PRODUCT_VERIFICATION_THANK_YOU'))),buttons:buttons||[{text:api.Text.parse('JSN_EXTFW_PRODUCT_VERIFICATION_LETS_GET_STARTED'),className:'btn btn-default',onClick:this.showConfirmTrackingModal.bind(this)}]});},showConfirmTrackingModal:function(){var link=this.getLink('update&context=settings');api.Modal.get({id:'jsn-confirm-tracking-modal',type:'html',title:api.Text.parse('JSN_EXTFW_TRACKING_CONFIRMATION_TITLE'),width:'550px',content:api.Text.parse('JSN_EXTFW_TRACKING_CONFIRMATION_CONTENT'),buttons:[{text:'JSN_EXTFW_TRACKING_CONFIRMATION_AGREE_BUTTON',className:'btn btn-primary',onClick:function(){api.Ajax.request(link,function(res){api.Tracking.initGA({extension:this.params.extension,enabled:1});}.bind(this),{allow_tracking:1});api.Modal.hide();}.bind(this)},{text:'JSN_EXTFW_TRACKING_CONFIRMATION_DECLINE_BUTTON',className:'btn btn-danger',onClick:function(){api.Ajax.request(link,function(res){api.Tracking.initGA({extension:this.params.extension,enabled:0});}.bind(this),{allow_tracking:0});api.Modal.hide();}.bind(this)}]});},parseLicense:function(extension){extension=extension||this.params.extension;if(this.data[extension]&&typeof this.data[extension].license=='string'){var d=this.data[extension].license.replace('@','=').split('.$.'),r=[],s=[],t=[],u=[];for(var i=1,n=d.length;i<n;i+=2){r.push(d[i]);}for(var i=0,n=r.length;i<n;i++){s=r[i].split('');t=[];for(var _i=1,_n=s.length;_i<_n;_i+=2){t.push(s[_i]);}u.push(Base64.decode(Base64.decode(t.join(''))));}try{return JSON.parse(u.join(''));}catch(e){return null;}}},n08mry0k:function(extension){extension=extension||this.params.extension;var license=this.parseLicense(extension);if(license){if(license.edition.charCodeAt(0)==70){if(license.edition.charCodeAt(1)==114){if(license.edition.charCodeAt(2)==101){if(license.edition.charCodeAt(3)==101){return true;}}}}return false;}return true;},U92QWjgZ:function(extension){extension=extension||this.params.extension;var license=this.parseLicense(extension);if(license){if(license.edition.charCodeAt(0)==80){if(license.edition.charCodeAt(1)==82){if(license.edition.charCodeAt(2)==79){if(license.edition.charCodeAt(3)==32){if(license.edition.charCodeAt(4)==84){if(license.edition.charCodeAt(5)==114){if(license.edition.charCodeAt(6)==105){if(license.edition.charCodeAt(7)==97){if(license.edition.charCodeAt(8)==108){return true;}}}}}}}}}}return false;},pFgstuRa:function(extension){extension=extension||this.params.extension;var license=this.parseLicense(extension);if(license){if(license.edition.charCodeAt(0)==80){if(license.edition.charCodeAt(1)==82){if(license.edition.charCodeAt(2)==79){if(license.edition.charCodeAt(3)==32){if(!api.isCurrentLicenseTrial(extension)){return true;}}}}}}return false;},qs967cJ5:function(extension){extension=extension||this.params.extension;var license=this.parseLicense(extension);if(license){return license.expired;}return false;},fQYARQ1r:function(extension){extension=extension||this.params.extension;if(api.isCurrentLicenseFree(extension)){return true;}else if(api.isCurrentLicenseTrial(extension)&&api.isCurrentLicenseExpired(extension)){return true;}return false;},introducePro:function(title,message,extension){extension=extension||this.params.extension;if(!title){title=api.Text.parse(extension.substr(4).toUpperCase()+'_TRY_PRO_TITLE');}if(!message){message=api.Text.parse(extension.substr(4).toUpperCase()+'_TRY_PRO_MESSAGE');}var content=React.createElement('div',{className:'introduction-content'},React.createElement('h4',null,title),React.createElement('p',null,message),React.createElement('p',null,api.Text.parse(api.isCurrentLicenseTrial(extension)&&api.isCurrentLicenseExpired(extension)?'JSN_EXTFW_PRO_INTRODUCTION_TRIAL_EXPIRED':'JSN_EXTFW_PRO_INTRODUCTION_MESSAGE')));api.Modal.get({id:'jsn-pro-introduction-modal',type:'html',title:api.Text.parse('JSN_EXTFW_PRO_INTRODUCTION_TITLE'),content:content,buttons:api.isCurrentLicenseTrial(extension)&&api.isCurrentLicenseExpired(extension)?[{text:api.Text.parse('JSN_EXTFW_PRO_INTRODUCTION_LATER_BUTTON'),className:'btn btn-link',onClick:api.Modal.hide},{text:api.Text.parse('JSN_EXTFW_PRO_INTRODUCTION_PURCHASE_PRO'),href:this.getLink('buyPro'),target:'_blank',className:'btn btn-primary'}]:[{text:api.Text.parse('JSN_EXTFW_PRO_INTRODUCTION_LATER_BUTTON'),className:'btn btn-link',onClick:api.Modal.hide},{text:api.Text.parse('JSN_EXTFW_PRO_INTRODUCTION_BUY_PRO_BUTTON'),href:this.getLink('buyPro'),target:'_blank',className:'btn btn-default btn-light'},{text:api.Text.parse('JSN_EXTFW_PRO_INTRODUCTION_TRY_PRO_BUTTON'),className:'btn btn-primary',onClick:function(modal,event){var button=event.target;button.disabled=true;button.origHTML=button.origHTML||button.innerHTML;button.innerHTML='<i class="fa fa-circle-o-notch fa-spin"></i>';button.origClass=button.origClass||button.className;button.className='btn btn-default disabled';button.previousElementSibling.disabled=true;api.Ajax.request(this.getLink('tryPro'),function(res){var reset=function(){button.disabled=false;button.innerHTML=button.origHTML;button.className=button.origClass;button.previousElementSibling.disabled=false;};if(!res.responseJSON||!res.responseJSON.success){reset();var error;if(res.responseJSON){error=res.responseJSON.message||res.responseJSON.error||res.responseJSON.data;}else{error=res.responseText;}this.tryProFailed(error);}else{this.getData(extension,function(){reset();this.verifyProduct(extension,true);}.bind(this));}}.bind(this));}.bind(this)}]});},tryProFailed:function(msg){api.Modal.get({id:'jsn-try-pro-failed-modal',type:'html',title:api.Text.parse('JSN_EXTFW_TRIAL_REGISTRATION_FAIL_TITLE'),width:'550px',content:api.Text.parse(msg||'JSN_EXTFW_TRIAL_REGISTRATION_FAIL_MESSAGE'),buttons:[{text:api.Text.parse('JSN_EXTFW_PRO_INTRODUCTION_LATER_BUTTON'),className:'btn btn-link',onClick:api.Modal.hide},{text:api.Text.parse('JSN_EXTFW_TRIAL_REGISTRATION_FAIL_BUTTON'),href:this.getLink('buyPro'),target:'_blank',className:'btn btn-primary'}]});}},UserVerification=api.UserVerification=React.createClass({displayName:'UserVerification',getDefaultProps:function(){return{id:'',accounts:[],forgotUsername:'',forgotPassword:''};},getInitialState:function(){return{account:this.props.accounts&&this.props.accounts.length?'existing':'another',existing:this.props.accounts&&this.props.accounts.length?this.props.accounts[0].value:'',username:'',password:''};},render:function(){return React.createElement('div',{id:this.props.id?this.props.id:api.Text.toId('user-verification',true),ref:'mountedDOMNode'},this.props.accounts&&this.props.accounts.length?[React.createElement('div',{className:'form-group'},React.createElement('div',{className:'form-check form-check-inline'},React.createElement('label',{className:'form-check-label',forName:'existing-account'},React.createElement('input',{id:'existing-account',type:'radio',name:'account',value:'existing',checked:this.state.account=='existing',onClick:this.change,className:'form-check-input'}),api.Text.parse('JSN_EXTFW_USER_VERIFICATION_SELECT_EXISTING_ACCOUNT'))),React.createElement('div',{className:'form-check form-check-inline'},React.createElement('label',{className:'form-check-label',forName:'another-account'},React.createElement('input',{id:'another-account',type:'radio',name:'account',value:'another',checked:this.state.account=='another',onClick:this.change,className:'form-check-input'}),api.Text.parse('JSN_EXTFW_USER_VERIFICATION_USE_ANOTHER_ACCOUNT')))),React.createElement('div',{className:'form-group',hidden:this.state.account=='existing'?false:true},React.createElement('select',{ref:'existing',name:'existing',className:'form-control',onChange:this.change},this.props.accounts.map(account=>{return React.createElement('option',{value:account.value,selected:this.state.existing==account.value},account.label);})))]:null,React.createElement('div',{className:'row',hidden:this.state.account=='another'?false:true},React.createElement('div',{className:'col-12'},React.createElement('p',null,api.Text.parse('JSN_EXTFW_USER_VERIFICATION_INPUT_CUSTOMER_ACCOUNT')),React.createElement('p',null,api.Text.parse('JSN_EXTFW_USER_VERIFICATION_ONE_TIME_REQUIREMENT'))),React.createElement('div',{className:'col-6'},React.createElement('div',{className:'form-group'},React.createElement('label',{forName:'input-username'},api.Text.parse('JSN_EXTFW_USERNAME'),' '+'(',React.createElement('a',{href:this.props.forgotUsername,target:'_blank'},api.Text.parse('JSN_EXTFW_USER_VERIFICATION_FORGOT_ACCOUNT')),')'),React.createElement('input',{id:'input-username',ref:'username',type:'text',name:'username',value:this.state.username,className:'form-control',onChange:this.change,onKeyUp:this.updateModalState}))),React.createElement('div',{className:'col-6'},React.createElement('div',{className:'form-group'},React.createElement('label',{forName:'input-password'},api.Text.parse('JSN_EXTFW_PASSWORD'),' '+'(',React.createElement('a',{href:this.props.forgotPassword,target:'_blank'},api.Text.parse('JSN_EXTFW_USER_VERIFICATION_FORGOT_ACCOUNT')),')'),React.createElement('input',{id:'input-password',ref:'password',type:'password',name:'password',value:this.state.password,className:'form-control',onChange:this.change,onKeyUp:this.updateModalState})))));},componentDidMount:function(){api.Text.setData(null,false,this);setTimeout(this.updateModalState,100);},change:function(event){var state={};state[event.target.name]=event.target.nodeName=='SELECT'?event.target.options[event.target.selectedIndex].value:event.target.value;this.setState(state);setTimeout(this.updateModalState.bind(this,event),1);},updateModalState:function(event){var body=this.refs.mountedDOMNode.parentNode;while(body&&(!body.classList||!body.classList.contains('modal-body'))&&body.nodeName!='BODY'){body=body.parentNode;}if(body.nodeName=='BODY'){return;}var modal=api.findReactComponent(body);if(modal){setTimeout(modal.forceUpdate.bind(modal),1);}var button=body.nextElementSibling.querySelector('.btn-primary');if(!button){return;}if(this.state.account=='existing'){button.disabled=false;}else{button.disabled=this.state.username==''||this.state.password=='';}if(event&&event.keyCode==13){button.click();}}});api.Edition.doVerifyUser=api.Edition.doVerifyUser.bind(api.Edition);var Modal=api.Modal={containerClass:'jsn-bootstrap4',container:null,modals:[],get:function(state,reuse){var modal,n=this.modals.length;if(n){var reuse=reuse===undefined?true:reuse;for(var i=0;i<n;i++){if(this.modals[i].props.preserve||this.modals[i].state.preserve){continue;}else if(reuse||this.modals[i].refs.mountedDOMNode.style.display=='none'){modal=this.modals[i];break;}}}if(!modal){var id=api.Text.toId('modal',true),element=document.createElement('div');if(!this.container){this.container=document.createElement('div');this.container.id=api.Text.toId('container',true);if(this.containerClass){this.container.className=this.containerClass;}document.body.appendChild(this.container);}this.container.appendChild(element);modal=ReactDOM.render(React.createElement(api.ElementModal,{id:id}),element);this.modals.push(modal);}api.Text.setData(null,false,modal);if(!state){state={};}if(state.show===undefined){state.show=true;}if(state['class']){state.className=state['class'];delete state['class'];}for(var p in api.ElementModal.defaultProps){if(state[p]===undefined){state[p]=api.ElementModal.defaultProps[p];}}modal.setState(state);return modal;},error:function(response){if(response){var error;if(response.responseJSON){error=response.responseJSON.message||response.responseJSON.error||response.responseJSON.data;}else{error=response.responseText;}return this.alert(error);}},alert:function(message,title){var modal=this.get({show:true,type:'html',title:title||null,content:message,width:480,height:0,buttons:[{text:api.Text.parse('close'),'class':'btn btn-default',onClick:function(modal){modal.close();},disabled:false}]});return modal;},confirm:function(message,okCallback,cancelCallback,doNotAutoClose,onModalShown,onModalHidden){var modal=this.get({show:true,type:'html',title:null,content:message,width:480,height:0,buttons:[{text:api.Text.parse('ok'),'class':'btn btn-primary',onClick:function(modal){if(!doNotAutoClose){modal.close();}if(typeof okCallback=='function'){okCallback(modal);}},disabled:false},{text:api.Text.parse('cancel'),'class':'btn btn-default',onClick:function(modal){modal.close();if(typeof cancelCallback=='function'){cancelCallback(modal);}},disabled:false}],onModalShown:onModalShown,onModalHidden:onModalHidden});return modal;},hide:function(){for(var i=0,n=this.modals.length;i<n;i++){if(this.modals[i].refs.mountedDOMNode.style.display!='none'){this.modals[i].close();}}},update:function(){for(var i=0,n=this.modals.length;i<n;i++){if(this.modals[i].refs.mountedDOMNode.style.display!='none'){this.modals[i].forceUpdate();}}},setContainerClass:function(className){this.containerClass=className;if(this.container){this.container.className=this.containerClass;}}};for(var p in api.Modal){if(typeof api.Modal[p]=='function'){api.Modal[p]=api.Modal[p].bind(api.Modal);}}var findObject=api.findObject=function(objectName){eval('var foundObject=typeof '+objectName+'!="undefined"?'+objectName+':null;');if(!foundObject){if(api[objectName]){foundObject=api[objectName];}else if(window[objectName]){foundObject=window[objectName];}}return foundObject;};var extendReactClass=api.extendReactClass=function(parentClass,classProps){var parentObject;if(typeof parentClass=='object'){var className=api.Text.toId('class',true);parentObject=api[className]=parentClass;parentClass='api.'+className;}else{eval('parentObject=typeof '+parentClass+'!="undefined"?'+parentClass+':null;');if(!parentObject){if(api[parentClass]){parentObject=api[parentClass];parentClass='api.'+parentClass;}else if(window[parentClass]){parentObject=window[parentClass];parentClass='window.'+parentClass;}}}if(parentObject){for(var p in parentObject.prototype){if(p=='constructor'){continue;}if(parentObject.prototype.hasOwnProperty(p)&&typeof parentObject.prototype[p]=='function'){if(classProps.hasOwnProperty(p)&&typeof classProps[p]=='function'){var exp=/this\.parent\s*\(([^\)]*)\)\s*;*/,func=classProps[p].toString(),match=func.match(exp);while(match){if(match[1].trim()!=''){func=func.replace(match[0],parentClass+'.prototype.'+p+'.call(this,'+match[1]+');');}else{func=func.replace(match[0],parentClass+'.prototype.'+p+'.apply(this,arguments);');}match=func.match(exp);}eval('classProps[p]='+func);}else{classProps[p]=parentObject.prototype[p];}}else if(p=='propTypes'&&!classProps.hasOwnProperty(p)){classProps[p]=parentObject.prototype[p];}}}return React.createClass(classProps);};var findReactComponent=api.findReactComponent=window.findReactComponent=function(node){var component;for(var p in node){if(p.startsWith('__reactInternalInstance$')){var internalNode=node[p]._currentElement,componentWrapper=internalNode._owner;if(componentWrapper){component=componentWrapper._instance;}}}if(!component&&node.parentNode){component=findReactComponent(node.parentNode);}return component;};var renderReactComponents=api.renderReactComponents=function(){var containers=document.querySelectorAll('[data-render]');for(var i=0;i<containers.length;i++){var Component=api.findObject(containers[i].getAttribute('data-render'));if(Component){var props={},remove=[];for(var j=0;j<containers[i].attributes.length;j++){var attribute=containers[i].attributes[j];if(attribute.name.indexOf('data-')==0){if(attribute.name!='data-render'){var name=api.Text.toCamelCase(attribute.name.substr(5));try{props[name]=JSON.parse(attribute.value);}catch(e){if(attribute.value.match(/^(true|false)$/i)){props[name]=attribute.value=='true'?true:false;}else if(attribute.value.match(/^\d+$/i)){props[name]=parseInt(attribute.value);}else{props[name]=attribute.value;}}}remove.push(attribute.name);}}for(var j=0;j<remove.length;j++){containers[i].removeAttribute(remove[j]);}ReactDOM.render(React.createElement(Component,props),containers[i]);}}};if(document.readyState=='complete'||document.readyState!='loading'&&!document.documentElement.doScroll){api.renderReactComponents();}else{api.Event.add(document,'DOMContentLoaded',api.renderReactComponents);}var Tracking=api.Tracking={initialized:false,lastEvent:null,config:{},nameMapping:{},initGA:function(config){var extension=config.extension||this.config.extension;if(this.initialized&&this.config.enabled==config.enabled||api.Edition.data[extension].token==''){return;}if(this.config.enabled!=config.enabled){setTimeout(function(){api.Event.trigger(this,'TrackingConfigChanged');}.bind(this),10);}for(var p in config){this.config[p]=config[p];}if(this.config.enabled&&!this.initialized){(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments);},i[r].l=1 * new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m);})(window,document,'script','https://www.google-analytics.com/analytics'+(this.config.debug?'_debug':'')+'.js','ga');ga('create',this.config.profile,'auto');ga('set','anonymizeIp',true);ga('send','pageview',this.getDimensions());this.initialized=true;}},postEvent:function(category,action,label){if(!this.config.enabled||this.skipPosting){delete this.skipPosting;return;}if(this.lastEvent!=category+action+label){ga('send','event',category,action,label,this.getDimensions());this.lastEvent=category+action+label;}},refineName:function(name){if(this.nameMapping[name]){return this.nameMapping[name];}return api.Text.capitalize(name.replace(/[^a-zA-Z0-9]+/g,' '));},getDimensions:function(){var set={};if(this.config.set){var root=api.Edition.rootComponent;for(var p in this.config.set){if(this.config.set[p]=='edition'){set[p]=api.Edition.parseLicense(this.config.extension).edition;}else if(this.config.set[p]=='width'){var w=(document.documentElement||document.body).clientWidth;if(w>=1920){w=1920;}else if(w>=1600){w=1600;}else if(w>=1440){w=1440;}else if(w>=1366){w=1366;}else if(w>=1280){w=1280;}else{w=1024;}set[p]=w.toString();}else{set[p]=this.config.set[p];}set[p]=typeof set[p]=='string'?set[p].toUpperCase():set[p];}}return set;}};for(var p in api.Tracking){if(typeof api.Tracking[p]=='function'){api.Tracking[p]=api.Tracking[p].bind(api.Tracking);}}})((JSN=window.JSN||{}));