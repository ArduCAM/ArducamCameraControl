/*
 * View model for ArducamCameraControl
 *
 * Author: Arducam
 * License: AGPLv3
 */
$(function() {
    function ArducamcameracontrolViewModel(parameters) {
        var self = this;
        var til = 90;
        var pan = 90;
        var step = 5;
        // assign the injected parameters, e.g.:
        // self.loginStateViewModel = parameters[0];
        // self.settingsViewModel = parameters[1];

        // TODO: Implement your plugin's view model here.

        self.onStartup = function() {
            $('#arducam-camera-control').insertBefore('#control-jog-custom')
            $("#control-til-up").click(function() {
                self.sendReq('ptz_til',til+step > 180 ? 180:til+step,function(){
                    til = til+step > 180 ? 180:til+step;
                    $('#contrl-pan-til-label').text(til)
                })
            })
            $("#control-til-down").click(function() {
                self.sendReq('ptz_til',til-step < 0 ? 0:til-step,function(){
                    til = til - step < 0 ? 0:til-step;
                    $('#contrl-pan-til-label').text(til)
                })
            })
            $("#control-pan-right").click(function() {
                self.sendReq('ptz_pan',pan+step > 180 ? 180:til+step,function(){
                    pan = pan+step > 180 ? 180:pan+step;
                    $('#contrl-pan-til-label').text(pan)
                })
            })
            $("#control-pan-left").click(function() {
                self.sendReq('ptz_pan',pan-step < 0 ? 0:pan-step,function(){
                    pan = pan - step < 0 ? 0:pan-step;
                    $('#contrl-pan-til-label').text(pan)
                })
            })
            $("#step1").click(function() {
                step = 5
            })
            $("#step2").click(function() {
                step = 10
            })
            $("#step3").click(function() {
                step = 20
            })
            $("#control-ptz-zoom").on("input",function() {
                const arm= parseInt(this.value);
                self.sendReq('ptz_zoom', arm, function() {});                              
            });
            $("#control-ptz-focus").on("input",function() {
                const arm= parseInt(this.value);
                self.sendReq('ptz_focus', arm, function() {});                              
            });
            $("ircut").click(function() {
                
                if (this.innerText === "ON") {
                    self.sendReq("ptz_ircut", 1, function(){
                        $("ircut").text('OFF')
                    })
                } else {
                    self.sendReq("ptz_ircut", 0, function(){
                        $("ircut").text('ON')
                    })
                }
            })
    }


        self.sendReq = function(command, value, fn) {
            $.ajax({
                url: `plugin/arducamcameracontrol`,
                type: 'POST',
                dataType: "json",
                data: JSON.stringify({
                    command: command,
                    value: value
                })
            }).done(()=>{if(fn){fn()}})
        }
    
        self.onDataUpdaterPluginMessage = function(plugin, data) {
            // console.log(data)
            if (plugin != "ArducamCameraControl") {
                return
            }

            if (data.ID) {
                switch (data.ID) {
                    case "0":
                        $('#control-til-pan button').each(function() {$(this).attr('disabled',true)})
                        $('#ircut').attr('disabled',true);
                        $('#control-ptz-zoom').attr('disabled', true);
                        $('#control-ptz-focus').attr('max', 1023);
                        break;
                    case "2":
                        $('#control-til-pan button').each(function() {$(this).attr('disabled',true)})
                        $('#control-ptz-zoom').attr('disabled', true);
                        $('#control-ptz-focus').attr('disabled', true);
                        $('#ircut').attr('disabled',true);
                        break
                    default:
                        break;
                }
            }

            
        }
        
        
        
    }


    

    /* view model class, parameters for constructor, container to bind to
     * Please see http://docs.octoprint.org/en/master/plugins/viewmodels.html#registering-custom-viewmodels for more details
     * and a full list of the available options.
     */
    OCTOPRINT_VIEWMODELS.push({
        construct: ArducamcameracontrolViewModel,
        // ViewModels your plugin depends on, e.g. loginStateViewModel, settingsViewModel, ...
        dependencies: [ /* "loginStateViewModel", "settingsViewModel" */ ],
        // Elements to bind to, e.g. #settings_plugin_ArducamCameraControl, #tab_plugin_ArducamCameraControl, ...
        elements: [ /* ... */ ]
    });
});
