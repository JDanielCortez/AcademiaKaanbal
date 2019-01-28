var InputCheckbox=api.InputCheckbox=extendReactClass('MixinInput',{render:function(){if(this.props.control.options&&this.props.control.options instanceof Array){return this.renderMultipleOptions();}else{return this.renderSingleOption();}},renderMultipleOptions:function(){var options=[],name=this.props.setting,className,checked;this.props.control.options.map(option=>{var optionLabel=api.Text.parse(option.label);className='form-check'+(this.props.control.inline?' form-check-inline':'');if(option.requires&&!this.props.form.isVisible(option.requires)){className+=' hidden';}if(this.props.control['multiple']===undefined||this.props.control['multiple']){checked=this.state.value.indexOf(option.value)>-1?true:false;}else{checked=this.state.value==option.value?true:false;}var optionTooltip;if(option.hint){optionTooltip=React.createElement(api.ElementTooltip,{hint:api.Text.parse(option.hint)});}var fieldName=name;if(this.props.control['multiple']===undefined||this.props.control['multiple']){fieldName+='[]';}options.push(React.createElement('div',{className:className},React.createElement('label',{className:'form-check-label'+(checked?' active':'')},React.createElement('input',{id:this.props.id+'_'+option.value,type:'checkbox',name:fieldName,value:option.value,checked:checked,onClick:this.change,disabled:this.props.disabled,className:'form-check-input '+(option['class']||'')}),optionLabel,optionTooltip)));});return React.createElement('div',{className:'form-group '+(this.props.control.className||'')},React.createElement('label',null,this.label,this.tooltip),options);},renderSingleOption:function(){var options=[],name=this.props.setting,className,checked;className='form-check'+(this.props.control.inline?' form-check-inline':'');if(!this.props.form.isVisible(this.props.control.requires)){className+=' hidden';}checked=this.state.value==this.props.control.value?true:false;return React.createElement('div',{className:className+' '+(this.props.control.className||'')},React.createElement('label',{className:'form-check-label'+(checked?' active':'')},React.createElement('input',{ref:'control',type:'checkbox',name:name,value:this.props.control.value,checked:checked,onClick:this.change,disabled:this.props.disabled,className:'form-check-input'}),this.label,this.tooltip));},change:function(event){api.__parent__();if(this.props.control['check-none']!==undefined&&!this.props.control['check-none']){var checkBoxes=ReactDOM.findDOMNode(this).querySelectorAll('input'),checked=0;for(var i=0,n=checkBoxes.length;i<n;i++){if(checkBoxes[i].checked){checked++;}}for(var i=0,n=checkBoxes.length;i<n;i++){if(checkBoxes[i].checked){checkBoxes[i].disabled=checked==1?true:false;}}}}});