<%@page contentType="text/html" pageEncoding="windows-1252"%>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

<c:set var="contextPath" value=""/>

<!DOCTYPE html>
<html>
    <head>
        <c:choose>
            <c:when test="${pageContext.response.locale == 'no'}">
                <meta charset="ISO-8859-1">
            </c:when>
            <c:otherwise>
                <meta charset="utf-8">
            </c:otherwise>        
        </c:choose>
                
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title><spring:message code="application.title"/></title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="apple-toacuch-icon" href="apple-touch-icon.png">  
        <link rel="stylesheet" href="./resources/css/bootstrap.min.css">    
        <style>
            body {
                padding-top: 50px;
                padding-bottom: 20px;
            }
        </style>        
        <link rel="stylesheet" href="./resources/css/bootstrap-theme.min.css">
        <link href="./resources/css/scrolling-nav.css" rel="stylesheet">
        <link rel="stylesheet" type="text/css" href="//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.2.0/css/font-awesome.css" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
        <link rel="stylesheet" href="./resources/css/main.css">
        <script src="./resources/js/vendor/shCore.js" type="text/javascript"></script>
        <script src="./resources/js/vendor/shBrushXml.js" type="text/javascript"></script>
        <script src="./resources/js/vendor/shBrushJScript.js" type="text/javascript"></script>              
        <link rel="stylesheet" href="./resources/css/shCore.css">
        <link rel="stylesheet" href="./resources/css/shThemeDefault.css">
        <link id="bsdp-css" href="./resources/css/bootstrap-datepicker.min.css" rel="stylesheet">
        <script src="./resources/js/vendor/modernizr-2.8.3-respond-1.4.2.min.js"></script>
        <!--<script src="./resources/js/load_schema.js" type="text/javascript"></script>-->   

        <script type="text/javascript">SyntaxHighlighter.all();</script>
            
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,300,0,-25" />
        
    </head>

    <body>
        <div id="page-top" data-spy="scroll" data-target=".navbar-fixed-top">
            <!--[if lt IE 8]>
                <p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
            <![endif]-->
            
        </div>

       <nav class="navbar navbar-inverse navbar-fixed-top nav-aal">
                <div class="container-fluid">
                    <!-- Brand and toggle get grouped for better mobile display -->
                    <div class="navbar-header">
                        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                            <span class="sr-only">Toggle navigation</span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                        </button>                    
                        <a class="navbar-brand" href="editor#page-top">
                                                     
                             <span class="hidden-sm hidden-xs"> ExplainTAP</span></a>
                    </div>

                    <!-- Collect the nav links, forms, and other content for toggling -->
                    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">

                        <ul class="nav navbar-nav navbar-right">
                            <li class="hidden active">
                                <a class="page-scroll" href="editor#page-top"></a>
                            </li>                        
                            <li>
                                <a id="homeTrigger" href="editor"><spring:message code="menu.editor"/></a>
                            </li>

                            <li>
                                <a id="privateRuleAction" href="privateRules"><spring:message code="menu.privateRulesLabel"/></a>
                            </li>

                            <li>
                                <a id="publicRuleAction" href="publicRules"><spring:message code="menu.publicRulesLabel"/></a>
                            </li>

                            <li>
                                <a id="simulatorAction" href="simulator" style="font-weight: bold; color: white; font-size: 17px;"><spring:message code="menu.simulatorLabel"/></a>
                            </li>
                            <li>
                                <a id="settingsAction" href="settings"><spring:message code="menu.settingsLabel"/></a>
                                <!--
                                <a id="settingsAction" href="settings" role="button" data-toggle="dropdown">spring:message code="menu.settingsLabel"/></a>
                                <ul class="dropdown-menu multi-level" role="menu" aria-labelledby="dropdownMenu">
                                    <li><a href="settings">General Settings</a></li>
                                    <li><a href="actionseditor">Actions Editor</a></li>  
                                </ul>
                                -->
                            </li>
                        <li class="dropdown">
                            <a id="navMultiLanguageButton" href="#" class="dropdown-toggle" data-toggle="dropdown"><span id="currentLang"> <spring:message code="menu.languageLable"/> </span> <i style="font-size: 0.8em;" class="glyphicon glyphicon-chevron-down"></i> </a>
                            <ul class="dropdown-menu">
                                <li id="enItem" class="langItem"><a href="?language=en" class="anchorLang"><i class="gb flag"></i> English </a></li>
                                <li id="deItem" class="langItem"><a href="?language=de" class="anchorLang"><i class="de flag"></i>German</a></li>
                                <li id="noItem" class="langItem"><a href="?language=no" class="anchorLang"><i class="no flag"></i> Norwegian </a></li>
                                <li id="itItem" class="langItem"><a href="?language=it" class="anchorLang"><i class="it flag"></i> Italian </a></li>
                                <li id="roItem" class="langItem"><a href="?language=ro" class="anchorLang"><i class="ro flag"></i> Romanian </a></li>
                            </ul>   
                        </li>
                            <li>
                            <a href="logout" id="logoutAction">< spring:message code="menu.logoutLabel"/></a>
                            <!--
                            <a href="#" id="logoutAction" onclick="document.forms['logoutForm'].submit();
                                return false;">< spring:message code="menu.logoutLabel"/></a>
                            -->
                            </li> 
                        </ul>   
                       
                </div><!-- /.navbar-collapse -->
            </div><!-- /.container-fluid -->
        </nav>     

        <div class="fantasmaBox" style="height: 5%;"></div>


        <section id="simulator" class="col-md-12 simulator-section">   
            <div id="conflictDetectionResult"></div>
            <div id="buttonContainer">                   
                <!--<button class="btn btn-default btn-lg" style="margin-right: 10px;">Set Initial Context</button>-->
                <button id="saveValueSimulator" class="btn btn-default btn-sm btnMenuSimulator">
                    <span class="material-symbols-rounded">bookmark</span>
                    <span class="labelButtonMenu"><spring:message code="simulator.save"/></span>
                </button>
                <button id="loadValueSimulator" class="btn btn-default btn-sm btnMenuSimulator">
                    <span class="material-symbols-rounded">download</span>
                    <span class="labelButtonMenu"><spring:message code="simulator.load"/></span>
                </button>   
                <button id="updateContext" class="btn btn-default btn-sm btnMenuSimulator">
                    <span class="material-symbols-rounded">check</span>
                    <span class="labelButtonMenu"><spring:message code="simulator.simulate"/></span>
                </button>  
                <button id="resetValue" class="btn btn-default btn-sm btnMenuSimulator">
                    <span class="material-symbols-rounded">refresh</span>
                    <span class="labelButtonMenu"><spring:message code="simulator.reset"/></span>
                </button>                
                <button id="conflictAnalisis" class="btn btn-default btn-sm btnMenuSimulator">
                    <span class="material-symbols-rounded">warning</span>
                    <span class="labelButtonMenu"><spring:message code="simulator.conflict"/></span>
                </button>
                <button id="goalOptimization" class="btn btn-default btn-sm btnMenuSimulator">
                    <span class="material-symbols-rounded">emoji_objects</span>
                    <span class="labelButtonMenu">Goal Advisor</span>
                </button><!--TODO: metti la stringa nello spring:message-->
            </div>
            <div id="contexButtonWhy">
                <!--<button class="btn btn-default btn-lg" style="margin-right: 10px;">Set Initial Context</button>-->                                 
                <button id="beackButton" class="btn btn-default btn-sm btnMenuSimulator">
                    <span class="material-symbols-rounded">arrow_back</span>
                    <span class="labelButtonMenu"><spring:message code="simulator.back"/></span>
                </button>
                <button id="updateContextCont" class="btn btn-default btn-sm btnMenuSimulator">
                    <span class="material-symbols-rounded">check</span>
                    <span class="labelButtonMenu"><spring:message code="simulator.simulate"/></span>
                </button>
            </div>
                
            
            
            <div id="treeContainer" class="col-md-7 col-sm-12">

                    <div><h3><b><spring:message code="simulator.titleContext"/>:</b></h3></div>

                <!--tabella a sinistra con il contesto-->
                <div id="tree"></div>
               
            </div>
                <!--testo avviso dei cambiamenti-->
                <div id="infoRules" class="col-md-5"></div>
                <!--sezione destra con le regole-->
                <div id="simulatorResult" class="col-md-5">
                </div>
            
        </section>
        
        
        <!-- conflict rule button  modal -->
        <div class="modal fade" id="singleRuleConflit" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close allowMobileTap" data-dismiss="modal" aria-hidden="true">x</button>
                        <span class="material-symbols-rounded">warning</span>
                        <h3 class="modal-title" id="title_ConflictSingleButton"></h3>
                    </div>
                    <div id="bodyConflictSingle" class="modal-body col-md-12">
                       
                            <p><strong><spring:message code="simulator.ruleInConflictWith"/> </strong><span id="ruleInConflict"> </span></p>
                            <p><strong><spring:message code="simulator.explanation"/> </strong><span id="explanation" class="explanationAlert"></span></p>
                               <p><strong>conflicting Actions: </strong><span id="explanationActions" class="explanationAlert"></span></p>
                             <hr>
                        
                        
                    </div>
                    <div class="modal-footer"></div>
                </div>
            </div>
        </div>
        
        
        <!-- conflict Analisis  modal -->
        <div class="modal fade" id="conflictAnalisisModal" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close allowMobileTap" data-dismiss="modal" aria-hidden="true">x</button>
                        <span class="material-symbols-rounded">warning</span>
                        <span class="modal-title" id="lineModalLabel"><spring:message code="simulator.conflict"/></span><!--TODO-->    
                    </div>
                    <div id="bodyConflictAnalisis" class="modal-body col-md-12">                                          
                        <p><strong><spring:message code="simulator.rule"/></strong><span> </span></p>    
                        <p><strong><spring:message code="simulator.ruleInConflictWith"/> </strong><span id="ruleInConflict"> </span></p>
                        <p><strong><spring:message code="simulator.explanation"/> </strong><span id="explanation" class="explanationAlert"></span></p>                                           
                    </div>
                    <div class="modal-footer"></div>
                </div>
            </div>
        </div>
        
        <!-- save line modal -->
        <div class="modal fade" id="saveConfModal" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close allowMobileTap" data-dismiss="modal" aria-hidden="true">x</button>
                        <span class="material-symbols-rounded">bookmark</span>
                        <span class="modal-title" id="lineModalLabel"><spring:message code="simulator.saveConf"/></span>
                    </div>
                    <div class="modal-body">
                        
                        <div id="alertSave"></div>
                        <!-- content goes here -->
                        <form>
                            <div class="form-group">
                                <label for="nameConf" class="labelModal"><spring:message code="simulator.confName"/>:</label>
                                <input type="text" class="form-control" id="nameConf" placeholder="Name Configuration">
                            </div>
                        </form>
                        
                    </div>
                    <div class="modal-footer">
                        <div class="btn-group btn-group-justified" role="group" aria-label="group button">
                            
                            <div class="btn-group btn-delete hidden" role="group">
                                <button type="button" id="delImage" class="btn btn-default btn-hover-red" data-dismiss="modal"  role="button"><spring:message code="repository._delete"/></button>
                            </div>
                            <div class="btn-group container" role="group">
                                <div class="buttonCenter">
                                    <button type="button" id="saveConf" class="btn btnConfirmation" data-action="save" role="button">
                                        <span><spring:message code="editorAction.save"/></span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- simulate rule modal -->
        <div class="modal fade" id="noRulesSelected" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close allowMobileTap" data-dismiss="modal" aria-hidden="true">x</button>
                        <span class="material-symbols-rounded">check</span>
                        <span class="modal-title" id="lineModalLabel"><spring:message code="simulator.simulate"/></span>
                    </div>
                    <div class="modal-body"> 
                        
                            <p class="labelModal" style="font-weight: 500;">No rules selected</p> <!--TODO-->
                        
                    </div>
                </div>
            </div>
        </div>
        
        <div class="modal fade" id="noRulesSelectedGoalOptimization" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content goalContent">
                    <div class="modal-header">                                               
                        <button type="button" class="close allowMobileTap" data-dismiss="modal" aria-hidden="true">x</button>
                        <span class="material-symbols-rounded">emoji_objects</span>
                        <span class="modal-title" id="lineModalLabel">Goal Advisor</span><!--TODO-->
                    </div>
                    <div class="modal-body"> 
                        
                            <p class="labelModal" style="font-weight: 500;">No rules selected</p> <!--TODO-->
                        
                    </div>
                </div>
            </div>
        </div>
                
                
        <!-- goal optimization modal -->
        <div class="modal fade" id="selectGoalOptimization" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
            <div class="modal-dialog" id="goalContent">
                <div class="modal-content">
                    <div class="modal-header">                                               
                        <button type="button" class="close allowMobileTap" data-dismiss="modal" aria-hidden="true">x</button>
                        <span class="material-symbols-rounded">emoji_objects</span>
                        <span class="modal-title" id="lineModalLabel">Goal Advisor</span><!--TODO-->
                    </div>
                    <div class="modal-body">
                        
                        <form id="selectionGoal">
                            <span class="labelModal"><spring:message code="editor.goal"/>: </span> 
                            <select name="goal" id="selectGoalforOptimization" class="form-control">
                                <option value=""><spring:message code="editor.none"/></option>
                                <option value="safety"><spring:message code="editor.safety"/></option>
                                <option value="health"><spring:message code="editor.health"/></option>
                                <option value="wellbeing"><spring:message code="editor.wellbeing"/></option>
                                <option value="comfort"><spring:message code="editor.comfort"/></option>
                                <option value="sociality"><spring:message code="editor.sociality"/></option>
                                <option value="security"><spring:message code="editor.security"/></option>
                                <option value="energysaving"><spring:message code="editor.energysaving"/></option>
                            </select>
                        </form>
                        
                        <div id="askForPreferences">
                            <p class="askPreferences labelModal" style="font-weight: normal;">
                                Would you like to add preferences?
                                <span class="choicePreferences">    
                                    <span id="yesAnswer">Yes</span>
                                    <span id="noAnswer">No</span>
                                </span>
                            </p>
                        </div>
                        
                        <p id="room_home" class="desideredValues labelModal roomLabel">Home:</p>
                        <div id="homeTemperatureDesidered" class="desideredValues inputDesire">
                            <span class="labelModal" style="font-weight: normal;">Temperature:</span>
                            <input type="number" id="homeDesideredTemperature" placeholder="Number" class="textAttribute form-control inputTrigger inputGoalSuggestions" style="width: 40%;">
                        </div>
                        <div id="homeHumidityDesidered" class="desideredValues inputDesire">
                            <span class="labelModal" style="font-weight: normal;">Humidity:</span>
                            <input type="number" id="homeDesideredHumidity" placeholder="Number" class="textAttribute form-control inputTrigger inputGoalSuggestions" style="width: 40%;">
                        </div>
                        
                        <p id="room_bedroom" class="desideredValues labelModal roomLabel">Bedroom:</p>
                        <div id="bedroomTemperatureDesidered" class="desideredValues inputDesire">
                            <span class="labelModal" style="font-weight: normal;">Temperature:</span>
                            <input type="number" id="bedroomDesideredTemperature" placeholder="Number" class="textAttribute form-control inputTrigger inputGoalSuggestions" style="width: 40%;">
                        </div>
                        <div id="bedroomHumidityDesidered" class="desideredValues inputDesire">
                            <span class="labelModal" style="font-weight: normal;">Humidity:</span>
                            <input type="number" id="bedroomDesideredHumidity" placeholder="Number" class="textAttribute form-control inputTrigger inputGoalSuggestions" style="width: 40%;">
                        </div>
                        
                        <p id="room_kitchen" class="desideredValues labelModal roomLabel">Kitchen:</p>
                        <div id="kitchenTemperatureDesidered" class="desideredValues inputDesire">
                            <span class="labelModal" style="font-weight: normal;">Temperature:</span>
                            <input type="number" id="kitchenDesideredTemperature" placeholder="Number" class="textAttribute form-control inputTrigger inputGoalSuggestions" style="width: 40%;">
                        </div>
                        <div id="kitchenHumidityDesidered" class="desideredValues inputDesire">
                            <span class="labelModal" style="font-weight: normal;">Humidity:</span>
                            <input type="number" id="kitchenDesideredHumidity" placeholder="Number" class="textAttribute form-control inputTrigger inputGoalSuggestions" style="width: 40%;">
                        </div>
                        
                        <p id="room_bathroom" class="desideredValues labelModal roomLabel">Bathroom:</p>
                        <div id="bathroomTemperatureDesidered" class="desideredValues inputDesire">
                            <span class="labelModal" style="font-weight: normal;">Temperature:</span>
                            <input type="number" id="bathroomDesideredTemperature" placeholder="Number" class="textAttribute form-control inputTrigger inputGoalSuggestions" style="width: 40%;">
                        </div>
                        <div id="bathroomHumidityDesidered" class="desideredValues inputDesire">
                            <span class="labelModal" style="font-weight: normal;">Humidity:</span>
                            <input type="number" id="bathroomDesideredHumidity" placeholder="Number" class="textAttribute form-control inputTrigger inputGoalSuggestions" style="width: 40%;">
                        </div>
                        
                        <p id="room_livingroom" class="desideredValues labelModal roomLabel">Living Room:</p>
                        <div id="livingroomTemperatureDesidered" class="desideredValues inputDesire">
                            <span class="labelModal" style="font-weight: normal;">Temperature:</span>
                            <input type="number" id="livingroomDesideredTemperature" placeholder="Number" class="textAttribute form-control inputTrigger inputGoalSuggestions" style="width: 40%;">
                        </div>
                        <div id="livingroomHumidityDesidered" class="desideredValues inputDesire">
                            <span class="labelModal" style="font-weight: normal;">Humidity:</span>
                            <input type="number" id="livingroomDesideredHumidity" placeholder="Number" class="textAttribute form-control inputTrigger inputGoalSuggestions" style="width: 40%;">
                        </div>
                        
                        <p style="color:red;" id="error_goalAdvisor_goal"></p>
                        <p style="color:red;" id="error_goalAdvisor"></p>
                        <p style="color:red;" id="error_goalChoice"></p>
                        
                        <button class="helpSugg closeHelp" id="helpSuggGoalOptimization">
                            <span class="material-symbols-rounded">help</span>
                        </button> 
                             
                    </div>
                    
                    <div class="modal-body" id="overlapHelpOptim" style="margin-left:96%;"> 
                        <p class="labelModal">Help</p>
                        <span id="textHelpOptim"></span>
                    </div>
                            
                    <div class="modal-footer" id="footerGoalSugg">
                        <div class="btn-group btn-group-justified" role="group" aria-label="group button">
                            <div class="btn-group container" role="group">
                                <div class="buttonCenter">
                                    <button type="button" id="modalGoalOptimizationOptimizeButton" class="btnConfirmation btn" role="button">
                                        <span>Optimize</span><!--TODO-->
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      
        <!-- save line modal -->
        <div class="modal fade" id="loadConfModal" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close allowMobileTap" data-dismiss="modal" aria-hidden="true">x</button>
                        <span class="material-symbols-rounded">download</span>
                        <span class="modal-title" id="lineModalLabel"><spring:message code="simulator.load"/></span>
                    </div>
                    <div class="modal-body">
                        
                        <div id="alertSave"></div>
                        <!-- content goes here -->
                        <form>
                            <div class="form-group">
                                <label for="nameConf" class="labelModal"><spring:message code="simulator.selectConf"/>:</label>
                                <select type="s" class="form-control" id="selectConf" placeholder="Name Configuration">                                                                        
                                </select>
                            </div>
                        </form>
                        
                    </div>
                    <div class="modal-footer">
                        <div class="btn-group" role="group" aria-label="group button"> 
                            <div class="btn-group btn-delete hidden" role="group">
                                <button type="button" id="delImage" class="btn btn-danger btn-hover-red" data-dismiss="modal"  role="button"><spring:message code="repository._delete"/></button>
                            </div>
                            <div class="btn-group container" role="group" style="width: 100%">
                                <div class="buttonCenter">
                                    <button type="button" id="loadConf" class="btn btnConfirmation" data-action="save" role="button"><span><spring:message code="simulator.load"/></span></button>
                                </div>    
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        <script type="text/javascript" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
        <script src="./resources/js/vendor/jquery-1.11.2.js"></script>
        <script src="./resources/js/vendor/bootstrap.min.js"></script>
        <script src="./resources/js/jquery-ui.js"></script>   
        <script src="./resources/js/vendor/jquery.easing.min.js"></script>
        <script src="./resources/js/vendor/scrolling-nav.js"></script>   
        <script src="./${actionsFilePath}"></script> 
        <script src="./resources/js/vendor/dataset.js" type="text/javascript"></script>
        <script src="./resources/js/vendor/color_classifier.js" type="text/javascript"></script>
        <script src="./resources/js/vendor/bootstrap-datepicker.min.js"></script>
        <script src="./resources/js/vendor/bootstrap-datepicker.en-GB.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.20.1/moment.js" type="text/javascript"></script>    
        <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.20.1/locale/en-au.js" type="text/javascript"></script>    
        <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datetimepicker/4.17.47/js/bootstrap-datetimepicker.min.js"></script>
        <script src="./resources/js/app-bundle.js"></script> 
        <script src="./resources/js/vendor/bootstrap-treeview.js"></script>
        <form id="logoutForm" method="POST" action="./logout">
            <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}"/>
            <input type="hidden" id="username" value="${pageContext.request.userPrincipal.name}"/>
        </form>
        <div id="testBar" style="display: none"></div>
        
               
    </body>
</html>