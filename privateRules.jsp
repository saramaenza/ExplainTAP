<%@page contentType="text/html" pageEncoding="windows-1252"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:set var="contextPath" value="${pageContext.request.contextPath}"/>

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">        
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="apple-touch-icon" href="apple-touch-icon.png">

        <link rel="stylesheet" href="./resources/css/bootstrap.min.css">
        <style>
            body {
                padding-top: 50px;
                padding-bottom: 20px;
            }
            .navbar-inverse {
                box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
            }
        </style>    
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,300,0,-25" />

        <link href="${contextPath}/resources/dist/semantic.css" rel="stylesheet">
        <link rel="stylesheet" href="./resources/css/bootstrap-theme.min.css">
        <link href="./resources/css/scrolling-nav.css" rel="stylesheet">
        <link rel="stylesheet" href="./resources/css/main.css">
       <!-- <link href='http://fonts.googleapis.com/css?family=Lobster' rel='stylesheet' type='text/css'>-->

        <script src="./resources/js/vendor/shCore.js" type="text/javascript"></script>
        <script src="./resources/js/vendor/shBrushXml.js" type="text/javascript"></script>
        <script src="./resources/js/vendor/shBrushJScript.js" type="text/javascript"></script>

        <link rel="stylesheet" href="./resources/css/shCore.css">
        <link rel="stylesheet" href="./resources/css/shThemeDefault.css">
        <link href="./resources/dist/semantic.css" rel="stylesheet">
        <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.10.19/css/jquery.dataTables.css">

        <!--<script src="./resources/js/vendor/modernizr-2.8.3-respond-1.4.2.min.js"></script>
        <script src="./resources/js/load_schema.js" type="text/javascript"></script>    -->

        <script type="text/javascript">SyntaxHighlighter.all();</script>

        <meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
        <title><spring:message code="application.title"/></title>                
    </head>
    <body >
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
                        <c:catch var="exception">${pageContext.request.userPrincipal.username}</c:catch>
                        <c:if test="${not empty exception}">${pageContext.request.userPrincipal.name}</c:if>                            
                        <span class="hidden-sm hidden-xs"><spring:message code="application.title"/></span></a>
                </div>

                <!-- Collect the nav links, forms, and other content for toggling -->
                <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">

                    <ul class="nav navbar-nav navbar-right">
                        <li class="hidden active">
                            <a class="page-scroll" href="editor#page-top"></a>
                        </li>                        
                        <li>
                            <a id="editorPage" href="editor"><spring:message code="menu.editor"/></a>
                        </li>
                        
                        <li>
                            <a id="privateRuleAction" href="privateRules" style="font-weight: bold; color: white; font-size: 17px;"><spring:message code="menu.privateRulesLabel"/></a>
                        </li>

                        <li>
                            <a id="publicRuleAction" href="publicRules"><spring:message code="menu.publicRulesLabel"/></a>
                        </li>

                        <li>
                            <a id="simulatorAction" href="simulator"><spring:message code="menu.simulatorLabel"/></a>
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
                            <a href="#" class="dropdown-toggle" data-toggle="dropdown"><span id="currentLang"> <spring:message code="menu.languageLable"/> </span> <i style="font-size: 0.8em;" class="glyphicon glyphicon-chevron-down"></i> </a>
                          <ul class="dropdown-menu">
                                <li id="enItem" class="langItem"><a href="?language=en"><i class="gb flag"></i> English </a></li>
                                <li id="deItem" class="langItem"><a href="?language=de"><i class="de flag"></i> German</a></li>
                                <li id="noItem" class="langItem"><a href="?language=no"><i class="no flag"></i> Norwegian </a></li>
                                <li id="itItem" class="langItem"><a href="?language=it"><i class="it flag"></i> Italian </a></li>
                                <li id="roItem" class="langItem"><a href="?language=ro"><i class="ro flag"></i> Romanian </a></li>
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
                    </li>
                    </ul>
                </div><!-- /.navbar-collapse -->
            </div><!-- /.container-fluid -->
        </nav>    
                        
        <div class="fantasmaBox" style="height: 10%;"></div>


        <div  class="container-fluid"> 
            <div class="row">
                <div style="background: white;" class="jumbotron jumbotron-sm">
                    <div class="container">
                        <div class="row">
                            <div class="col-sm-12 col-lg-12">
                                <h1 class="h1"><spring:message code="menu.privateRulesLabel"/></h1>
                                <hr>
                            </div>
                        </div>
                    </div>
                </div>

              
            </div>    
        </div> 
       
     <div class="col-md-12 privateRulesButtons">
        <div class="text-center visible-md visible-lg">
            <button class="btn btn-default btn-sm btnMenuSimulator" onclick="showModalApplyRule()">
                <span class="material-symbols-rounded">play_arrow</span>
                <span class="labelButtonMenu"><spring:message code="repository.apply"/></span>         
            </button>
            <button class="btn btn-default btn-sm btnMenuSimulator" onclick="deleteRulesFromAE()">
                <span class="material-symbols-rounded">stop</span>
                <span class="labelButtonMenu"><spring:message code="repository.not_apply"/></span>  
            </button>                    
            <button class="btn btn-default btn-sm btnMenuSimulator" onclick="getExplanations()">
                <span class="material-symbols-rounded">info</span>
                <span class="labelButtonMenu"><spring:message code="menu.simulatorLabel"/></span>  
            </button>            
            <button class="btn btn-default btn-sm btnMenuSimulator" onclick="savePriority()">
                <span class="material-symbols-rounded">Bookmark</span> 
                <span class="labelButtonMenu"><spring:message code="repository.save_priority"/></span>  
            </button>
            <button class="btn btn-default btn-sm btnMenuSimulator" onclick="askConfirmationDeleteRule();">
                <span class="material-symbols-rounded">Delete</span>  
                <span class="labelButtonMenu"><spring:message code="repository._delete"/></span>  
            </button>
            <button class="btn btn-default btn-sm btnMenuSimulator" onclick="uploadToPublicRepository()">
                <span class="material-symbols-rounded">Publish</span>  
                <span class="labelButtonMenu"><spring:message code="repository.upload_public"/></span> 
            </button>
            <button class="btn btn-default btn-sm btnMenuSimulator" onclick="downloadAllRulesJson(false)">
                <span class="material-symbols-rounded">Download</span>  
                <span class="labelButtonMenu"><spring:message code="repository.download_json"/></span> 
            </button>
            <button class="btn btn-default btn-sm btnMenuSimulator" onclick="downloadAllRulesXml(false)">
                <span class="material-symbols-rounded">Download</span>  
                <span class="labelButtonMenu"><spring:message code="repository.download_xml"/></span> 
            </button>
        </div>
        
        
        <div class="visible-xs visible-sm">
            <button class="btn btn-default btn-sm btnMenuSimulator" onclick="showModalApplyRule()">
                <span class="material-symbols-rounded">play_arrow</span> 
            </button>
            <button class="btn btn-default btn-sm btnMenuSimulator" onclick="deleteRulesFromAE()">
               <span class="material-symbols-rounded">stop</span> 
            </button>          
            <button class="btn btn-default btn-sm btnMenuSimulator" onclick="getExplanations()">
               <span class="material-symbols-rounded">info</span> 
            </button>   
            <button class="btn btn-default btn-sm btnMenuSimulator" onclick="savePriority()">
                <span class="material-symbols-rounded">Boomark</span> 
            </button>
            <button class="btn btn-default btn-sm btnMenuSimulator " onclick="askConfirmationDeleteRule();">
                <span class="material-symbols-rounded">Delete</span> 
            </button>
            <button class="btn btn-default btn-sm btnMenuSimulator " onclick="uploadToPublicRepository()">
                <span class="material-symbols-rounded">Publish</span> 
            </button>
            <button class="btn btn-default btn-sm btnMenuSimulator" onclick="downloadAllRulesJson(false)">
                <span class="material-symbols-rounded">Download</span>  
            </button>
            <button class="btn btn-default btn-sm btnMenuSimulator" onclick="downloadAllRulesXml(false)">
                <span class="material-symbols-rounded">Download</span>  
            </button>
        </div>
   </div>

        <!--tabella dinamica regole private-->
        <div class="container-fluid">
           
                <div class="col-xs-12">
                     <div class="table-responsive">
                        <div  id="privateRulesContainer"></div>   
                     </div>
                </div>
            
        </div>
        


        <div class="modal fade" id="codeModal" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">

                    <div class="modal-header">
                        <button type="button" class="close allowMobileTap" data-dismiss="modal" aria-hidden="true">x</button>
                        <span class="material-symbols-rounded">warning</span>
                        <span class="modal-title" id="codeTitle"></span>  
                    </div>

                    <div class="modal-body">
                        <div class="row">
                            <div class="col-xs-12" id="codeContainer">

                            </div>
                        </div>                        
                    </div>
                    
                    <div class="modal-footer" id="footerGoalSugg">
                        <div class="btn-group btn-group-justified" role="group" aria-label="group button">
                            <div class="btn-group container" role="group">
                                <div class="buttonCenter">
                                    <button type="button" class="btnConfirmation btn" role="button">
                                        <span>Optimize</span><!--TODO-->
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
                        <span class="modal-title" id="lineModalLabel">Analysis</span>
                    </div>
                    <div class="modal-body"> 
                        
                            <p class="labelModal" style="font-weight: 500;">No rules selected</p> <!--TODO-->
                        
                    </div>
                </div>
            </div>
        </div>
        
        <div class="modal fade allowMobileTap" id="modalDeleteExternalRule">
            <div class="modal-dialog">
                <div class="modal-content">

                    <div class="modal-header">
                        <button type="button" class="close allowMobileTap" data-dismiss="modal" aria-hidden="true">x</button>
                        <h4 class="modal-title"><spring:message code="repository._delete"/></h4>
                    </div>

                    <div class="modal-body">
                        <div class="row">
                            <div class="col-xs-12" id="deleteExternalRuleTxt">

                            </div>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-defaul" data-dismiss="modal"><spring:message code="repository.cancel"/></button>
                        <button type="button" class="btn btn-danger" id="modalDeleteRuleConfirmButton" onclick="deleteExternalRule()"><spring:message code="repository._delete"/></button>
                        <input type="hidden" value="-1" id="ruleIdx">
                    </div>
                </div>
            </div>
        </div>


        <div class="modal fade allowMobileTap" id="modalDeleteRule">
            <div class="modal-dialog">
                <div class="modal-content">

                    <div class="modal-header">
                        <button type="button" class="close allowMobileTap" data-dismiss="modal" aria-hidden="true">x</button>
                        <h4 class="modal-title"><spring:message code="repository._delete"/></h4>
                    </div>

                    <div class="modal-body">
                        <div class="row">
                            <div class="col-xs-12" id="deleteRuleTxt">

                            </div>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-defaul" data-dismiss="modal"><spring:message code="repository.cancel"/></button>
                        <button type="button" class="btn btn-danger" id="modalDeleteRuleConfirmButton" onclick="deleteRule()"><spring:message code="repository._delete"/></button>
                        <input type="hidden" value="-1" id="ruleIdx">
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade allowMobileTap" id="modalRuleSaved">
            <div class="modal-dialog">
                <div class="modal-content">

                    <div class="modal-header">
                        <button type="button" class="close allowMobileTap" data-dismiss="modal" aria-hidden="true">x</button>
                        <h4 class="modal-title" id="msgContainer"><spring:message code="repository._delete"/></h4>
                    </div>

                    <div class="modal-body" id="msgTxt">
                        <spring:message code="repository.rule_saved"/>
                    </div>

                </div>
            </div>
        </div>

        <div class="modal fade" id="modalApplyRules" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">

                    <div class="modal-header">                                               
                        <button type="button" class="close allowMobileTap" data-dismiss="modal" aria-hidden="true">x</button>
                        <span class="material-symbols-rounded">play_arrow</span>
                        <span class="modal-title" id="lineModalLabel">Apply Rule</span><!--TODO-->
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div id="adaptionError" class="col-xs-12"></div>
                            <div class="col-xs-12">
                                User Name<br/>
                                <input type="text" class="form-control" id="modalUserNameValue" tabindex="1" value="${pageContext.request.userPrincipal.name}">
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-xs-12">
                                It has to be the same user name you use for the subscription to the Rule Manager<br/>                                
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer" id="footerGoalSugg">
                        <div class="btn-group btn-group-justified" role="group" aria-label="group button">
                            <div class="btn-group container" role="group">
                                <div class="buttonCenter">
                                    <button type="button" id="modalRuleNameConfirmButton" class="btnConfirmation btn" role="button" onclick="sendRulesToAE()">
                                        <span>Apply Rule</span><!--TODO-->
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade allowMobileTap" id="modalError">
            <div class="modal-dialog">
                <div class="modal-content">
                    
                    <div class="modal-header">
                        <button type="button" class="close allowMobileTap" data-dismiss="modal" aria-hidden="true">x</button>
                        <span class="material-symbols-rounded">warning</span>
                        <span class="modal-title" id="lineModalLabel">Error</span>
                    </div>

                    <div class="modal-body">
                        <div class="row">
                            <div id="errorBox" class="col-xs-12"></div>                            
                        </div>                        
                    </div>                   
                </div>
            </div>
        </div>                  

        <script src="./resources/js/vendor/jquery-1.11.2.js"></script>
        <script src="./resources/js/vendor/bootstrap.min.js"></script>
        <!-- Scrolling Nav JavaScript -->
        <script src="./resources/js/vendor/jquery.easing.min.js"></script>
        <script src="./resources/js/vendor/scrolling-nav.js"></script>
               
         <script src="./${actionsFilePath}"></script>

        <script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/1.10.19/js/jquery.dataTables.js"></script>
               
        <script src="${contextPath}/resources/js/vendor/dataset.js" type="text/javascript"></script>
        <script src="${contextPath}/resources/js/vendor/color_classifier.js" type="text/javascript"></script>
        <script src="./resources/js/utils/tableSorter.js" type="text/javascript"></script>
        <script src="${contextPath}/resources/js/logger.js"></script>
        <script src="./resources/js/app-bundle.js"></script> 
        <form id="logoutForm" method="POST" action="./logout">
            <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}"/>
            <input type="hidden" id="username" value="${pageContext.request.userPrincipal.name}"/>
        </form>
        <div id="testBar" style="display: none"></div>   
    </body>
</html>
