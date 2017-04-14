/**
 * Created by hyochan on 9/23/15.
 */
module.exports =  {
    sendJSON : function(result, res) {
        res.setHeader('Content-Type', 'application/json; charset=utf8');
        res.json(result);
    },
    writeHTML : function(html, res){
        res.writeHeader(200, {"Content-Type": "text/html"});
        res.write(html);
        res.end();
    },
    renderPAGE : function(page, res){
        res.render(page);
    },
    renderPAGE_JSON : function(page, json, res){
        res.render(page, json);
    }
};