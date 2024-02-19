/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import GLOBALS from '../global';
import NaturalLanguage from '../NaturalLanguage';
var triggerCtrl = require('../triggerTreeCtrl'); 
import {showRulesList, drawPrivateTableHeader} from '../../view/tableRules'
import {getNaturalLanguageLocale, getNaturalLanguageResponseMsgLocale,getRepositoryLabelLocale, getGoalLocale} from '../translation';
import {deleteAdaptationEngineRule} from '../../service/api';
import { ruleMap } from '../../view/ruleMap';
import {showDimensions} from '../../view/triggerTree';
var utility = require('../../view/utility');
var externalDeleteRuleId;
var rules;

export function loadRulesFromRepository(response) {

    $('#intro').addClass('hidden');
    $('#triggers').removeClass('hidden');
    $('#contexttypeSwitch').removeClass('hidden');
    $('#searchtriggerElementBox').removeClass('hidden');

    var rIdx = -1;
    GLOBALS.rules = new Array();
    GLOBALS.original_rules = new Array();
    var rulesToBeRemoved = new Array();
    for (var i = 0; i < response.rules.length; i++) {
        for (var j = 0; j < response.rules[i].triggers.length; j++) {
            var el = triggerCtrl.getAttribute(GLOBALS.ctx[response.rules[i].triggers[j].dimension],
                    response.rules[i].triggers[j].parent, response.rules[i].triggers[j].element.realName);
            if (el !== undefined){
                 if(el.realName === "typeOfProximity"){
                    el.binding = {
                        bindingAttribute: "pointOfInterest",
                        bindingClass: "RelativePosition"
                    };
                    el.type = 'proximityType';
                   
                }
                if(el.realName === "pointOfInterest"){
                    el.actualData= {
                         attributeName: "name",
                         className: "environment/room"
                    };
                    el.type = 'proximityType';
                }
                response.rules[i].triggers[j].element = el;
            }else {
                if (rulesToBeRemoved.indexOf(response.rules[i].id) === -1)
                    rulesToBeRemoved.push(response.rules[i].id);
            }
        }
        for (var j = 0; j < response.rules[i].actions.length; j++) {
            var _root = getActionRoot(response.rules[i].actions[j].root);
            if (_root === undefined)
                continue;
            response.rules[i].actions[j].root = _root;
            if (response.rules[i].actions[j].action.type !== 'composed') {
                var el = getAttributeAction(_root,
                        response.rules[i].actions[j].parent, response.rules[i].actions[j].action.realName);
       
                if (el !== undefined){
                   
                    response.rules[i].actions[j].action = el;
                }else {
                    if (rulesToBeRemoved.indexOf(response.rules[i].id) === -1)
                        rulesToBeRemoved.push(response.rules[i].id);
                }
            } else {
                //composed actions
                if (response.rules[i].actions[j].action.description === undefined) {
                    var act = getActionsByName(response.rules[i].actions[j].action.realName, _root);
                    if (act !== undefined && act.description !== undefined && act.description !== '')
                        response.rules[i].actions[j].action.description = act.description;
                }
                for (var z = 0; z < _root.attributes.length; z++) {
                    if (_root.attributes[z].possibleValues !== undefined)
                        response.rules[i].actions[j].values[z].possibleValues = _root.attributes[z].possibleValues;
                    else {
//                                if(rulesToBeRemoved.indexOf(i) === -1)
//                                    rulesToBeRemoved.push(i);
                    }
                }
            }
        }

    }
    for (var i = 0; i < response.rules.length; i++) {
        //todo remove undefined actions
        if (rulesToBeRemoved.indexOf(response.rules[i].id) === -1) {
            if (getURLParameter('id') !== "null" &&
                    getURLParameter('id') === response.rules[i].id) {
                rIdx = GLOBALS.rules.push(response.rules[i]) - 1;
            } else
                GLOBALS.rules.push(response.rules[i]);
                GLOBALS.original_rules.push(JSON.parse(JSON.stringify(response.rules[i])));
        }
    }
    
    if (rIdx > -1) {
        editRule(rIdx);
        $('#saveRuleButton').removeAttr('disabled');
        $('#saveAsRuleButton').removeAttr('disabled');
        $('#saveAndApplyRuleButton').removeAttr('disabled');

        $('#saveRuleButton_main').removeAttr('disabled');
        $('#saveAsRuleButton_main').removeAttr('disabled');
        $('#saveAndApplyRuleButton_main').removeAttr('disabled');
        showDimensions();
    } else {
        newRule();
        showRulesList(GLOBALS.rules, false);
        getAppliedRules();
    }
    rules = GLOBALS.rules;
}


function createExternalRule(i, id, ruleName, naturalLanguage) {
    if ($("#externalRule" + id).length > 0) {
        $("#externalRule" + id).addClass('ruleActive');
        return;
    }
    var ruleCode = "<tr id=\"externalRule" + id + "\" class=\"ruleList ruleActive\">";
    //ruleCode += "<td><input type=\"checkbox\" id=\"checkbox_externalRule" + id + "\" value=\"" + i + "\" checked=checked disabled=disabled class=\"externalRule\"></td>";
    ruleCode += "<td>External Rule</td>";
    ruleCode += "<td><input type=\"number\" id=\"priority_" + id + "\" value=\"0\" min=\"1\" max=\"99\" disabled=disabled></td>";
    ruleCode += "<td class=\"ruleGoal\">" + getGoalLocale("none") + "</td>";
    ruleCode += "<td class=\"ruleName\">";
    ruleCode += "<span class='ruleLabel'>" + ruleName + "</span>";
    ruleCode += "</td>";
    ruleCode += "<td class=\"ruleTrigger\">";
    ruleCode += "<span class='naturalLanguageText'>" + naturalLanguage + "</span>";
    ruleCode += "</td>";
    ruleCode += "<td class=\"ruleName\">---</td>";
    ruleCode += "<td class=\"ruleButtons\">";
    ruleCode += '<button type="button" class="btn btn-danger deleteRuleButton" onclick="askConfirmationDeleteExternalRule(' + id + ');"><span class="glyphicon glyphicon-trash"></span> ' + getRepositoryLabelLocale("_delete") + '</button>';
    ruleCode += "</td>";
    ruleCode += "</tr>";
    ruleCode += "</table></div>";

    return ruleCode;
}
//TODO: il sistema di caricamento da public non funziona benissimo: 
//può bloccarsi se sono cambiati i files delle azioni. Sarebbe da 
//debuggare getAttributeAction
export function loadRulesFromPublicRepository() {
    var token = $("#logoutForm > input").val();
    $.ajax({
        type: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': token
        },
        url: "rest/loadRulesFromPublicRepository/appName/" + GLOBALS.appName,
        dataType: 'json',
        success: function (response)
        {
            console.log(response);
            GLOBALS.publicRules = new Array();
            for (var k = 0; k < response.userRules.length; k++) {
                for (var i = 0; i < response.userRules[k].rulesList.rules.length; i++) {
                    for (var j = 0; j < response.userRules[k].rulesList.rules[i].triggers.length; j++) {
                        var el = triggerCtrl.getAttribute(GLOBALS.ctx[response.userRules[k].rulesList.rules[i].triggers[j].dimension],
                                response.userRules[k].rulesList.rules[i].triggers[j].parent, response.userRules[k].rulesList.rules[i].triggers[j].element.realName);
                        if (el !== undefined){
                            console.log("TRIGGER:", el);
                            response.userRules[k].rulesList.rules[i].triggers[j].element = el;
                        }
                    }
                    for (var j = 0; j < response.userRules[k].rulesList.rules[i].actions.length; j++) {
                        var _root = getActionRoot(response.userRules[k].rulesList.rules[i].actions[j].root);
                        response.userRules[k].rulesList.rules[i].actions[j].root = _root;
                        if (response.userRules[k].rulesList.rules[i].actions[j].action.type !== 'composed') {
                            var el = getAttributeAction(_root,
                                    response.userRules[k].rulesList.rules[i].actions[j].parent, response.userRules[k].rulesList.rules[i].actions[j].action.realName);
                            if (el !== undefined)
                                {
                                console.log("ACTION:", el);    
                                response.userRules[k].rulesList.rules[i].actions[j].action = el;
                                }
                        } else {
                            //composed actions
                            for (var z = 0; z < _root.attributes.length; z++) {
                                response.userRules[k].rulesList.rules[i].actions[j].possibleValues = _root.attributes[z].possibleValues;
                            }
                        }
                    }
                }
                GLOBALS.publicRules = GLOBALS.publicRules.concat(response.userRules[k].rulesList.rules);
            }
            GLOBALS.publicRules.admin = response.admin;
            showRulesList(GLOBALS.publicRules, true);
            console.log("Rules loaded from public repository");
        },
        error: function (err) {
            console.log(err);
        }
    });
}

function getActionsByName(actionName, root) {
    var toRet = undefined;
    if (root === undefined || root.nodes === undefined || root.nodes.length === 0)
        return undefined;
    for (var i = 0; i < root.nodes.length; i++) {
        if (root.nodes[i].realName === actionName) {
            toRet = root.nodes[i];
            break;
        }
        toRet = getActionsByName(actionName, root.nodes[i]);
        if (toRet !== undefined)
            return toRet;
    }
    return toRet;
}

function getAttributeAction(category, parent, attributeName) {
    for (var i = 0; i < category.attributes.length; i++) {
        if (category.realName === parent && category.attributes[i].realName === attributeName)
            return category.attributes[i];
    }
    for (var i = 0; i < category.nodes.length; i++) {
        var tmp = getAttributeAction(category.nodes[i], parent, attributeName);
        if (tmp !== undefined)
            return tmp;
    }
    return undefined;
}


function editRule(idx) {
    //check if is rule involving time trigger between an interval
    checkTimeIntervalTriggers(GLOBALS.rules[idx].triggers);
    GLOBALS.ruleUpdateTriggers = $.extend(true, [], GLOBALS.rules[idx].triggers);
    GLOBALS.ruleUpdateActions = $.extend(true, [], GLOBALS.rules[idx].actions);
    GLOBALS.trigger = GLOBALS.rules[idx].triggers;
    GLOBALS.actions = GLOBALS.rules[idx].actions;
    ruleMap.writeSteps('trigger', GLOBALS.trigger);
    ruleMap.writeSteps('action', GLOBALS.actions);
    ruleMap.openSection('trigger', true);
    ruleMap.openSection('action', true);
    if ($('.actionModeBox').length > 0) {
        console.log(GLOBALS.rules[idx].actionMode);
        $("input[name='actionMode'][value=" + rules[idx].actionMode + "]").prop("checked", true);
    }

    $('#titleRule_name').html(GLOBALS.rules[idx].ruleName);
    GLOBALS.currentRuleIdx = idx;
    GLOBALS.tmpAction = undefined;
    GLOBALS.tmpTrigger = undefined;
    GLOBALS.tmpTriggerArray = new Array();
    $("#triggerCategoryContainer").html("");
    $(".triggerSubCategory").remove();
    $(".subcategory").remove();
    $(".triggerDimensionButtons ").removeClass('selected');
    $("#subActionsContainer").remove();
    $("#actionLeafContainer").html("");
    $(".subcategoryAction").remove();
    $(".actionDimensionButtons ").removeClass('selected');
    $("#naturalLanguage").html(NaturalLanguage.getNl(false, false));
    $("#homeTrigger").click();

    for (var i = 0; i < GLOBALS.rules[idx].triggers.length; i++) {
        if (GLOBALS.rules[idx].triggers[i].notValue.length > 0)
            GLOBALS.rules[idx].triggers[i].isNot = true;
        else
            GLOBALS.rules[idx].triggers[i].isNot = false;
    }
}

function checkTimeIntervalTriggers(_triggers) {
    for (var i = 0; i < _triggers.length; i++) {
        if (_triggers[i].element.realName === "LocalTime" &&
                _triggers[i].operator === 'gt' &&
                _triggers[i + 1] !== undefined &&
                _triggers[i + 1].element.realName === "LocalTime" &&
                _triggers[i + 1].operator === 'lt')
            _triggers[i].isBetween = true;
    }
}


export function getActionRoot(rootName) {
    for (var i = 0; i < GLOBALS.actionDefinition.length; i++) {        
        if (rootName === GLOBALS.actionDefinition[i].realName) {
            return GLOBALS.actionDefinition[i];
        }
    }
    //arrivo qui, non ho trovato
    //guardo tra i nodi figli
    for (var i = 0; i < GLOBALS.actionDefinition.length; i++) {        
        for (var j = 0; j < GLOBALS.actionDefinition[i].nodes.length; j++) {
            if (rootName === GLOBALS.actionDefinition[i].nodes[j].realName) {
                return GLOBALS.actionDefinition[i].nodes[j];
            }
        }
    }
}

function getURLParameter(name) {
    return decodeURI((RegExp(name + '=' + '(.+?)(&|$)').exec(location.search) || [, null])[1]);
}

export function getAppliedRules() {
    if (window.location.protocol === "https:" &&
            GLOBALS.adaptationEngineURL.startsWith("http:")) {
        $("#modalError").modal('show');
        $('#errorBox').html('<div class="ui red message">Current protocol is https, but Rule Manager URL is http.<br>\n\
            This request has been blocked because the content must be served over HTTPS, please update the the Rule Manager URL in settings section.<br>\n\
            Protocol HTTPS - Port: 8443</div>');
        return;
    }
    $.ajax({
        type: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url: GLOBALS.adaptationEngineURL + "/rest/appliedRules/userName/" + encodeURIComponent(GLOBALS.username) + "/appName/" + GLOBALS.appName,
        dataType: 'json',
        success: function (response){
            if (response.status === 'OK') {
                $('.ruleList').removeClass('ruleActive');
                for (var i = 0; i < response.ruleId.length; i++) {
                    if ($("#checkbox_privateRule" + response.ruleId[i]).length > 0) {
                        $("#checkbox_privateRule" + response.ruleId[i]).prop('checked', false);
                        $("#checkbox_privateRule" + response.ruleId[i]).parent().parent().addClass('ruleActive');
                    } else {
                        //rule creaded outside the authoring tool:
                        //they can be visualized in natural language and deleted but not edited
                        var ruleCode = createExternalRule(i, response.ruleId[i], response.ruleName[i], response.naturalLanguage[i]);
                        if($("#ruleTable").length){
                            $("#ruleTable").append(ruleCode);
                        }
                        else { //create the table if not already present
                            let tableCode = "<div class='table-responsive'>";
                            tableCode +="<table id='ruleTable' class='table table-bordered table-striped'>";
                            tableCode+="<tbody>";
                            tableCode+=drawPrivateTableHeader();
                            //console.log("tablecode: ");
                            //console.log(tableCode);
                            tableCode += ruleCode;
                            tableCode+="</tbody>";
                            tableCode +="</table></div>";
                            $("#privateRulesContainer").append(tableCode);
                        }
//                        
                    }
                }
            }


        },
        error: function (err) {
            console.log(err);
        }
    });
}

window.goToEditRule = function (idx, ruleName, natLanguage) {
    //$('#intro').addClass('hidden');
    // updateEvent("clickEditRule", "editRuleButton", ruleName + "_" + natLanguage);
    //deleteAdaptationEngineRule(idx); //why here? we don't want a rule to be automatically removed each time "edit" is clicked
    window.location.href = "editor?id=" + idx;
};

window.askConfirmationDeleteRule = function () {
    var ruleNames = "";
    var count = 0;
    if ($("#privateRulesContainer .ruleList input[type=checkbox]").is(":checked")) {
        $("#modalDeleteRuleConfirmButton").show();
        $("#privateRulesContainer .ruleList input[type=checkbox]").each(function () {
            if ($(this).is(":checked")) {
                if (count > 0)
                    ruleNames += ", ";
                ruleNames += '<strong>' + $(this).closest("tr").find(".ruleName").text() + '</strong>';
                count++;
            }
        });
        var alertMsg = "<br> "+ getNaturalLanguageLocale("rule_manager_delete_alert");
        $("#deleteRuleTxt").html(getNaturalLanguageLocale("rule_manager_delete_sure") + ruleNames + " " + alertMsg);
    } else {
        $("#deleteRuleTxt").html("No rules selected");
        $("#modalDeleteRuleConfirmButton").hide();
    }
    $("#modalDeleteRule").modal();
};

window.deleteExternalRule = function(){
    console.log(externalDeleteRuleId);
     $("#modalDeleteExternalRule").modal('hide');
    $.ajax({
        type: "DELETE",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            //'X-CSRF-TOKEN': token
        },
        url: GLOBALS.adaptationEngineURL + "/rest/deleteRuleV2/appName/" + GLOBALS.appName + "/userName/" +GLOBALS.username + "/ruleOriginalId/" + externalDeleteRuleId,
        dataType: 'json',
        //data: JSON.stringify(delRulesParam),
        success: function (response){
            if (response.status === 'DELETED') {
                //GLOBALS.rules.splice(tmpIdx, 1); non sono in globals
                //deleteAdaptationEngineRule(externalDeleteRuleId); 
                $("#msgContainerDelete").html(getNaturalLanguageResponseMsgLocale("rules_deleted"));
                $("#modalRuleDeleteResult").modal();
                showRulesList(GLOBALS.rules, false);
                getAppliedRules();
            } else {
                $("#msgContainerDelete").html(getNaturalLanguageResponseMsgLocale("rules_not_deleted"));
                $("#modalRuleDeleteResult").modal();
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
    return;
};

window.deleteRule = function () {
    var tmpIdx = new Array();
    if ($("#privateRulesContainer .ruleList input[type=checkbox]").is(":checked")) {
        $("#privateRulesContainer .ruleList input[type=checkbox]").each(function () {
            if ($(this).is(":checked")) {
                var id = $(this).attr("id");
                var idx = id.substring(20);
                tmpIdx.push(idx);
            }
        });
    } else {
        $("#msgContainer").html("Error");
        $("#msgTxt").html(getNaturalLanguageResponseMsgLocale("rule_not_selected"));
        $("#modalRuleSaved").modal();
        return;
    }
    var token = $("#logoutForm > input").val();
    var delRulesParam = new Array();
    for (var i = tmpIdx.length - 1; i >= 0; i--) {
        var tmpRuleName = $("#checkbox_privateRule" + tmpIdx[i]).val();
        var tmpParam = {
            ruleId: tmpIdx[i],
            ruleName: tmpRuleName
        };
        delRulesParam.push(tmpParam);
    }
    $("#modalDeleteRule").modal('hide');
    $.ajax({
        type: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': token
        },
        url: "rest/deleteRule/appName/" + GLOBALS.appName,
        dataType: 'json',
        data: JSON.stringify(delRulesParam),
        success: function (response){
            console.log(response);
            if (response.status === 'DELETED') {
                var deletedRuleNames = "";
                for (var i = 0; i < response.deletedRules.length; i++) {
                    var tmpId = response.deletedRules[i].ruleId;
                    var tmpIdx = getRuleIdxById(GLOBALS.rules, tmpId);
                    deletedRuleNames += response.deletedRules[i].ruleName;
                    if (i > 0 && i < response.deletedRules.length - 1)
                        deletedRuleNames += ", ";
                    GLOBALS.rules.splice(tmpIdx, 1);

                    deleteAdaptationEngineRule(tmpId);
                }
                $("#msgContainerDelete").html(getNaturalLanguageResponseMsgLocale("rules_deleted") + ": " + deletedRuleNames);
                $("#modalRuleDeleteResult").modal();
                showRulesList(GLOBALS.rules, false);
                getAppliedRules();
            } else {
                var notDeletedRuleNames = "";
                for (var i = 0; i < response.notDeletedRules.length; i++) {
                    notDeletedRuleNames += response.notDeletedRules[i];
                    if (i > 0 && i < response.deletedRules.length - 1)
                        notDeletedRuleNames += ", ";
                }
                $("#msgContainerDelete").html(getNaturalLanguageResponseMsgLocale("rules_not_deleted") + ": " + notDeletedRuleNames);
                $("#modalRuleDeleteResult").modal();
            }
        },
        error: function (err) {
            console.log(err);
        }
    });


    GLOBALS.currentRuleIdx = undefined;
    showRulesList(GLOBALS.rules, false);
    //resetTrigger();
    // resetTempAction();
    $("#triggerCategoryContainer").html("");
    $(".triggerSubCategory").remove();
    $(".subcategory").remove();
    $(".triggerDimensionButtons ").removeClass('selected');
    $("#subActionsContainer").remove();
    $("#actionLeafContainer").html("");
    $(".subcategoryAction").remove();
    $(".actionDimensionButtons ").removeClass('selected');
    $("#naturalLanguage").html("<div class=\"naturalLanguageText\">" + getNaturalLanguageResponseMsgLocale("edit_rule") + "</div>");
};

function getRuleIdxById(rulesList, id) {
    for (var i = 0; i < rulesList.length; i++) {
        if (rulesList[i].id === id)
            return i;
    }
    return -1;
}


window.savePriority = function () {
    var token = $("#logoutForm > input").val();
    var priorityList = new Array();
    $("#privateRulesContainer .ruleList input[type=number]").each(function () {
        var idComposed = $(this).attr("id");
        var id = idComposed.substring(20);
        var tmpPriority = $(this).val();
        if (tmpPriority === undefined || tmpPriority < 0)
            tmpPriority = 0;
        priorityList.push({
            ruleId: id,
            priority: tmpPriority
        });
    });
    $.ajax({
        type: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': token
        },
        url: "rest/savePriority/appName/" + GLOBALS.appName,
        dataType: 'json',
        data: JSON.stringify(priorityList),
        success: function (response)
        {
            if (response.status === 'SAVED') {
                $("#msgContainer").html("Success");
                $("#msgTxt").html(getNaturalLanguageResponseMsgLocale("priority_saved"));
                $("#modalRuleSaved").modal();
            } else {
                $("#msgContainer").html("Error");
                $("#msgTxt").html(getNaturalLanguageResponseMsgLocale("priority_not_saved") + ": " + response.error_msg);
                $("#modalRuleSaved").modal();
            }
        },
        error: function (err) {
            $("#msgContainer").html("Error");
            $("#msgTxt").html(getNaturalLanguageResponseMsgLocale("priority_not_saved"));
            $("#modalRuleSaved").modal();
        }
    });
};

window.uploadToPublicRepository = function () {
    var token = $("#logoutForm > input").val();
    var ruleToUpload = new Array();
    if ($("#privateRulesContainer .ruleList input[type=checkbox]").is(":checked")) {
        $("#privateRulesContainer .ruleList input[type=checkbox]").each(function () {
            if ($(this).is(":checked")) {
                var id = $(this).attr("id");
                var idx = id.substring(20);
                ruleToUpload.push(idx);
            }
        });
        $.ajax({
            type: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': token
            },
            url: "rest/uploadToPublicRepository/appName/" + GLOBALS.appName,
            dataType: 'json',
            data: JSON.stringify(ruleToUpload),
            success: function (response)
            {
                if (response.status === 'UPLOADED') {
                    $("#msgContainer").html("Success");
                    $("#msgTxt").html(getNaturalLanguageResponseMsgLocale("rule_uploaded"));
                    $("#modalRuleSaved").modal();
                    //loadRulesFromPublicRepository();
                } else {
                    $("#msgContainer").html("Error");
                    $("#msgTxt").html(getNaturalLanguageResponseMsgLocale("rule_not_uploaded") + ": " + response.error_msg);
                    $("#modalRuleSaved").modal();
                }
            },
            error: function (err) {
                $("#msgContainer").html("Error");
                $("#msgTxt").html(getNaturalLanguageResponseMsgLocale("rule_not_uploaded"));
                $("#modalRuleSaved").modal();
            }
        });
    } else {
        $("#msgContainer").html("Error");
        $("#msgTxt").html(getNaturalLanguageResponseMsgLocale("rule_not_selected"));
        $("#modalRuleSaved").modal();
    }
};

window.downloadAllRulesJson = function (isPublic) {
    var url = "rest/downloadAllRuleJson/" + GLOBALS.appName + "/isPublic/" + isPublic;
    var win = window.open(url, '_blank');
    win.focus();
};

var _publicDeleteRuleId;
window.askConfirmationDeletePublicRule = function (ruleId) {
    //var ruleName = $("#checkbox_publicRule" + ruleId).val(); //Does not select the rule name!
    let selector = $("#publicRule" + ruleId);
    let ruleName = selector.find(".ruleName")[0].innerText;
    _publicDeleteRuleId = ruleId;
    //$("#deletePublicRuleTxt").html(getRepositoryLabelLocale("delete_rule") + " " + ruleName + " rule?"); // Rephrased to remove the hardcoded "rule"
    $("#deletePublicRuleTxt").html(ruleName + ": " + getRepositoryLabelLocale("delete_rule"));
    $("#modalDeletePublicRule").modal();
};

window.askConfirmationDeleteExternalRule = function (ruleId) {
    externalDeleteRuleId = ruleId;
    $("#modalDeleteRuleConfirmButton").show();
    console.log($("#externalRule"  + ruleId));
    console.log($("#externalRule"  + ruleId).children("td.ruleName"));
    console.log($("#externalRule"  + ruleId).find("span.ruleLabel"));
    let ruleName = $("#externalRule"  + ruleId).find("span.ruleLabel").text();
    $("#deleteExternalRuleTxt").html(getRepositoryLabelLocale("delete_rule") + " " + ruleName + "?");
    $("#modalDeleteExternalRule").modal();
};

window.confirmDeletePublicRule = function () {
    if (_publicDeleteRuleId === -1 || _publicDeleteRuleId === undefined) {
        $("#modalDeletePublicRule").modal('hide');
        $("#msgContainerDelete").html(getNaturalLanguageResponseMsgLocale("rules_not_deleted"));
        $("#modalRuleDeleteResult").modal();
        return;
    }
    var token = $("#logoutForm > input").val();
    $.ajax({
        type: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': token
        },
        url: "rest/deletePublicRule/appName/" + GLOBALS.appName + "/ruleId/" + _publicDeleteRuleId,
        dataType: 'json',
        success: function (response)
        {
            $("#modalDeletePublicRule").modal('hide');
            if (response.status === 'DELETED') {
                var deletedRuleName = response.ruleName;
                var tmpIdx = getRuleIdxById(GLOBALS.publicRules, response.id);
                GLOBALS.publicRules.splice(tmpIdx, 1);
                $("#msgContainerDelete").html(getNaturalLanguageResponseMsgLocale("rules_deleted") + ": " + deletedRuleName);
                $("#modalRuleDeleteResult").modal();
                showRulesList(GLOBALS.publicRules, true);
            } else {
                $("#msgContainerDelete").html(getNaturalLanguageResponseMsgLocale("rules_not_deleted"));
                $("#modalRuleDeleteResult").modal();
            }
        },
        error: function (err) {
            $("#modalDeletePublicRule").modal('hide');
            $("#msgContainerDelete").html(getNaturalLanguageResponseMsgLocale("rules_not_deleted"));
            $("#modalRuleDeleteResult").modal();
            console.log(err);
        }
    });
    GLOBALS.currentRuleIdx = undefined;
    showRulesList(GLOBALS.rules, false);
    utility.resetTrigger();
    utility.resetTempAction();
    $("#triggerCategoryContainer").html("");
    $(".triggerSubCategory").remove();
    $(".subcategory").remove();
    $(".triggerDimensionButtons ").removeClass('selected');
    $("#subActionsContainer").remove();
    $("#actionLeafContaiareAllEventsner").html("");
    $(".subcategoryAction").remove();
    $(".actionDimensionButtons ").removeClass('selected');
    $("#naturalLanguage").html("<div class=\"naturalLanguageText\">" + getNaturalLanguageResponseMsgLocale("edit_rule") + "</div>");
};

window.showModalApplyRule = function () {
    $("#modalApplyRules").modal('show');
};

var selectedRules = new Array();

window.getExplanations = function () {
    // Trova gli input di tipo checkbox selezionati
    var checkedCheckboxes =  $("#privateRulesContainer .ruleList input[type=checkbox]:checked");
    if (checkedCheckboxes.length > 0) {
        // Itera sugli input di tipo checkbox selezionati
        checkedCheckboxes.each(function () {
            var selectedId = parseInt($(this).attr("id").replace("checkbox_privateRule", "")); 
            var matchedRule = rules.find(item => item.id === selectedId);
            if (matchedRule && !selectedRules.some(rule => rule.id === selectedId)) {
              selectedRules.push(matchedRule.id);
            }
        });
        var stringSelectedRules = JSON.stringify(selectedRules);
        var url = "simulator?var="+encodeURIComponent(stringSelectedRules);
        window.location.href = url;
    } else {
      $('#noRulesSelected').modal('show');
      $("#noRulesTxt").html("No rules selected");
    }
};

window.cancelDeletePublicRule = function () {
    _publicDeleteRuleId = -1;
    $("#modalDeletePublicRule").modal('hide');
};