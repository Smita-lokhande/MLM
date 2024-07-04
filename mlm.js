function usermsgfun(msg){
    document.getElementById("divusermsg").style.visibility = "visible";
    document.getElementById("usermsg12").innerHTML = msg;
    setTimeout(function(){
    document.getElementById("divusermsg").style.visibility = "hidden";
    }, 2000);
}
function sendmessage1(){
    let rtext = "https://wa.me/91" + 8009936009;
    window.open(rtext, 'xyz');
}
function sendmessage2(){
    let rtext = "https://wa.me/91" + 8009926009
    window.open(rtext, 'xyz');
}
function subscribem(){
    $.ajax({
        url: "/1/mlm",
        type: 'POST',
        data: {
            action: 'subscribem',
            moduleid: '21',
        },
        //contentType: "text/plain; charset=utf-8",
        cache: false,
        success: function subscribe(res) {
            if(res === 'sessionexpired'){
                alert("Session Expired, Please login Again")
                window.location.replace("/1/login")
            }else{
                if (res === "Saved") {
                    usermsgfun("Your trial period of 3 days is started.")
                    window.location.replace('/1/menu')
                }
                else if(res==="used"){
                    usermsgfun("Please buy subscription of 1 year, You already used your trial period")
                }
            }
        }
    })
}
function orginfom(){
    document.getElementById("morginfo").style.display= "none";
    document.getElementById("org").style.display= "block";
}
function saveorginfo(){
    if($("#nameorg").val()===''){
        return alert("Enter the oraganiztion name")
    }
    if($("#orgaddress").val()===''){
        return alert("Enter the address name")
    }
    if($("#orgcity").val()===''){
        return alert("Enter the city name")
    }
    if($("#orgstate").val()===''){
        return alert("Enter the state name")
    }
    if($("#orgemail").val()===''){
        return alert("Enter the email name")
    }
    if($("#phoneno").val()===''){
        return alert("Enter the mobile number ")
    }
        $.ajax({
            url: "/1/mlm",
            type: 'POST',
            data: {
                action: 'saveorginfom',
                nameorg:  $("#orgname").val(),
                phoneno: $("#phoneno").val(),
                orgaddress:  $("#orgaddress").val(),
                orgaddress2:  $("#orgaddress1").val(),
                orgcity:  $("#orgcity").val(),
                orgstate:  $("#orgstate").val(),
                orgemail:  $("#orgemail").val(),
            },
            cache: false,
            success: function user(res) {
                usermsgfun(res);
                cancelorgdb();
                window.location.replace('/1/menu')
            }
            
        })
    }
    function cancelorgdb(){
        document.getElementById("mainmenu").style.display="block";
        document.getElementById("org").style.display="none";
        document.getElementById("mlmtreeinformation").style.display="none";
        window.location.replace('/1/menu')
    }
    function updateorginfo(){
        retriveorginfo();
        retrivebgstylecolormlm();
        document.getElementById("updateorgnization").style.display="block";
        document.getElementById("mainmenu").style.display="none";
    }
    function retriveorginfo(){
        $.ajax({
            url: "/1/mlm",
            type: 'POST',
            data: {
                action: 'retriveorginfo',
            },
            cache: false,
            success: function user(res) {
                document.getElementById("organizationname").value=res[0];
                document.getElementById("orgmobileno").value=res[1];
                document.getElementById("uaddress").value=res[2];
                document.getElementById("uaddress1").value=res[3];
                document.getElementById("ucity").value=res[4];
                document.getElementById("ustate").value=res[5];
                document.getElementById("uemail").value=res[6];
            }
        })
    }
    function updateorg(){
        if($("#organizationname").val()===''){
            return alert("Enter the oraganiztion name")
        }
        if($("#uaddress").val()===''){
            return alert("Enter the address name")
        }
        if($("#ustate").val()===''){
            return alert("Enter the state name")
        }
        if($("#ucity").val()===''){
            return alert("Enter the city name")
        }
        if($("#uemail").val()===''){
            return alert("Enter the email name")
        }
        if($("#orgmobileno").val()===''){
            return alert("Enter the mobile name")
        }
         //document.getElementById("loader2").style.visibility="visible";
        $.ajax({
            url: "/1/mlm",
            type: 'POST',
            data: {
                action: 'updateorg',
                nameorg:  $("#organizationname").val(),
                phoneno: $("#orgmobileno").val(),
                uaddress: $("#uaddress").val(),
                uaddress1: $("#uaddress1").val(),
                ucity: $("#ucity").val(),
                ustate: $("#ustate").val(),
                uemail: $("#uemail").val()
            },
            cache: false,
            success: function user(res) {
                usermsgfun (res);
                retriveorginfo();
            }
    
        })
    }
    //orgcolor mlm
    function orgcolormlm(){
        if($("#csscolor").val()===''){
            return alert("Please Select Color name")
        }
        if($("#csscolor").val()==='Color Name'){
            return alert("Please Select Color name")
        }
        $.ajax({
            url: "/1/mlm",
            type: 'POST',
            data: {
                action: 'orgcolormlm',
                csscolor:  $("#csscolor").val(),
            },
            cache: false,
            success: function user(res) {
                if(res === 'sessionexpired'){
                    alert("Session Expired, Please login Again")
                    window.location.replace("/1/login")
                }else{
                
                usermsgfun("updated successfully");
                window.location.replace("/1/menu");
                }
            }
    
        })
    
    }
    function retrivebgstylecolormlm(){
        $.ajax({
            url:"/1/mlm",
            type: 'POST',
            data: {
                action: 'retrivebgstylecolormlm',
            },
            cache: false,
            success: function savecaller(res) {
            //  alert(res)
                var slsn1 = document.getElementById("csscolor")
                if(slsn1!=null){
                    slsn1.length = 0
                    slsn1[slsn1.length] = new Option('Color Name')
                    for (i = 0; i < res.length; i++) {
                        var myOption = document.createElement("option");
                        try{
                            var x=JSON.parse(res[i]);
                            myOption.text = x.name;
                            myOption.value = x.filename;
                            slsn1.add(myOption);
                        }catch(err)
                        {   
                        }
                    }
                }      
            }
        })
    } 
    // function retrivorgcolormlm(){
    //     $.ajax({
    //         url: "/1/mlm",
    //         type: 'POST',
    //         data: {
    //             action: 'retrivorgcolormlm' ,
    //         },
    //         cache: false,
    //         success: function user(res) {
    //             if(res == 'error' || res =='No Image'){
    //             }else{
    //                 applyorgcolor(res);
    //                 // alert(res)
    //             }
    //         }
    //     })  
    // }
    
    function mlmlogou(){
        var filename;
        var uploadimg = document.getElementById("uploadlogo");
        var uploaddata=uploadimg.value;
        if(!uploadimg.files[0]){
            return alert("Please select file first");
        }
        var size = uploadimg.files[0].size / 1024 /1024;  
       
        var fileext = uploaddata.split(".").pop();
        if(fileext !== 'jpg' && fileext !== 'png' && fileext !== 'jpeg' ){
            return alert("please select 'jpg' image extention")
        }
        if(size > 1){
            return alert("please select file less than 1 mb");
        }
            var filestore = uploadimg.files[0];
            var formdata = new FormData();
            formdata.append('image',filestore);
            formdata.append('action','savefile');
            fetch('/1/fileoperations',{method: "POST", body: formdata}).then(response=>response.text()).then(data=>{
                $.ajax({
                    url: "/1/mlm",
                    type: 'POST',
                    data: {
                        action: 'mlmlogou',
                        uploaddata:uploaddata
                    },
                    cache: false,
                    success: function savecaller(res) {
                        if(res === 'sessionexpired'){
                            alert("Session Expired, Please login Again")
                            window.location.replace("/1/login")
                        }else{
                            if(res =='error'){
                                usermsgfun("Error while uploading image try again later")
                            }else{
                                getlogomlm();
                                usermsgfun("Logo uploded Successfully")
                            } 
                        }
                        }
                })
            })
    }
    function getlogomlm(){
        $.ajax({
            url: "/1/mlm",
            type: 'POST',
            data: {
                action: 'getlogomlm' 
            },
            cache: false,
            success: function user(res) {
                if(res === 'sessionexpired'){
                    alert("Session Expired, Please login Again")
                    window.location.replace("/1/login")
                }else{
                    if(res == 'error' || res =='No Image'){
                    }else{
                        document.getElementById("logupload").innerHTML="<img src='/getmlmlogo/"+res+"' style='margin-left:2%; height:100px;'>"
                    }
                }
            }
        })
    }
    function mlmpage(){
    document.getElementById("mainmenu").style.display="none";
    document.getElementById("multilevelmarketingpage").style.display="block";
    retriveplanname2();
    }
    function cancelupdateorginfo(){
        document.getElementById("updateorgnization").style.display="none";
        document.getElementById("mainmenu").style.display="block";
    }
    function addmember(){
        document.getElementById("addmemberinfo").style.display="block";
        document.getElementById("favdialogaddmember").style.display="block";
    }
    function closemember(){
        document.getElementById("favdialogaddmember").style.display="none";
    }
    function planinfo(){
        document.getElementById("setting").style.display="block";
        document.getElementById("mainmenu").style.display="none";
        retrivplan();
        retriveplanname1();
    }
    function payrollinfo(){
        document.getElementById("payrollinformationpage").style.display="block";
        document.getElementById("mainmenu").style.display="none";
    }
    function closepayroll(){
        document.getElementById("payrollinformationpage").style.display="none";
        document.getElementById("mainmenu").style.display="block";
    }
    function closesetting(){
        document.getElementById("setting").style.display="none";
        document.getElementById("mainmenu").style.display="block";
    }
    /// setting  ///
    function saveplanname(){
        if($("#newplanadd").val()==='' ) {
            alert("Please enter plan  name")
            return
       }
        $.ajax({
            url: "/1/mlm",
            type: 'POST',
            data: {
                action: 'saveplan',
                newplanadd: $("#newplanadd").val(),
                
            },
            cache: false,
            success: function user(res) {
                if(res === 'sessionexpired'){
                    alert("Session Expired, Please login Again")
                    window.location.replace("/1/login")
                }else{
                    if(res==='Information saved successfully'){
                        usermsgfun("Information saved successfully")
                        retriveplanname1();
                    }else{
                        usermsgfun(res)
                    }
                }
            }
        })
    }
    function retrivplan(){
        $.ajax({
            url:"/1/mlm",
            type: 'POST',
            data: {
                action: 'retrivplan',
            },
            cache: false,
            success: function savecaller(res) {
                var slsn1 = document.getElementById("selecteplan")
                
                if(slsn1!=null){
                    slsn1.length = 0
                     slsn1[slsn1.length] = new Option('Plans')
                    for (i = 0; i < res.length; i++) {
                        var myOption = document.createElement("option");
                        try{
                            var x=JSON.parse(res[i]);
                            myOption.text = x.planname;
                            myOption.value = x.planid;
                            slsn1.add(myOption);
                        }catch(err)
                        {
                            
                        }
                    }
                }      
            }
        })
    }
    function retriveplanname(){
        var refrenceid=$("#userid2").val();
        $.ajax({
            url:"/1/mlm",
            type: 'POST',
            data: {
                action: 'retriveplanname',
                userid:refrenceid,
            },
            cache: false,
            success: function savecaller(res) {
                
                var slsn1 = document.getElementById("showplan")
                if(slsn1!=null){
                    slsn1.length = 0
                    slsn1[slsn1.length] = new Option('Plan Name')
                    for (i = 0; i < res.length; i++) {
                        var myOption = document.createElement("option");
                        try{
                            var x=JSON.parse(res[i]);
                            myOption.text = x.planname;
                            myOption.value = x.planid;
                            slsn1.add(myOption);
                        }catch(err)
                        {   
                        }
                    }
                }      
            }
        })
    }
    function retriveplanname1(){
        $.ajax({
            url:"/1/mlm",
            type: 'POST',
            data: {
                action: 'retriveplanname1',
            },
            cache: false,
            success: function savecaller(res) {
                var slsn1 = document.getElementById("showplan1")
                if(slsn1!=null){
                    slsn1.length = 0
                    slsn1[slsn1.length] = new Option('Plan Name')
                    for (i = 0; i < res.length; i++) {
                        var myOption = document.createElement("option");
                        try{
                            var x=JSON.parse(res[i]);
                            myOption.text = x.planname;
                            myOption.value = x.planid;
                            slsn1.add(myOption);
                        }catch(err)
                        {   
                        }
                    }
                }      
            }
        })
    }
    function plandetailsinfo(){
        document.getElementById("plandetails").style.display="block";
        document.getElementById("favdialogplandetains").style.display="block";
    }
    function closeplandetails(){
        document.getElementById("favdialogplandetains").style.display="none";
    }
    function savelevelvalues(){
        // var share = $('#share').val();
        // var lavel = $('#lavelvalues').val();
        var planid = $("#showplan1").val();
        $.ajax({
            url: "/1/mlm",
            type: 'POST',
            data: {
                action: 'savelevelvalues',
                level: $('#lavelvalues').val(),
                share: $('#share').val(),
                planid:planid,
                 
            },
            cache: false,
            success: function user(res) {
                showplaninfo();
                share.value = '';
                lavelvalues.value = '';
                usermsgfun(res)
            }
        })
    }
    function showplaninfo(){
        var planid = $("#showplan1").val();
        $.ajax({
            url: "/1/mlm",
            type: 'POST',
            data: {
                action: 'showplaninfo', 
                planid:planid
            },
            cache: false,
            success: function user(res) {
                if(res === 'sessionexpired'){
                    alert("Session Expired, Please login Again")
                    window.location.replace("/1/login")
                }else{
                    document.getElementById("showplanreport").innerHTML=res;   
                }  
            }
        })

    }
    function managemember(){
        retriveplanname();
        document.getElementById("managem").style.display="block";
        document.getElementById("mainmenu").style.display="none";
    }
    function searchmember(){
        if($("#staffmobilenumber").val()==='' ){
            alert("Please enter mobile number or name")
            return
       }
       $.ajax({
           url: "/1/mlm",
           type: 'POST',
           data: {
               action: 'searchmember',
               mobileno:$("#staffmobilenumber").val(),
           },
           cache: false,
           success: function user(res) {
                   if (res === 'sessionexpired') {
                       alert("Session Expired, Please login Again");
                       window.location.replace("/1/login");
                   } else if (Array.isArray(res)) {
                       // User is registered, update HTML elements
                       document.getElementById("membername1").value = res[1];
                       document.getElementById("memberemail").value = res[2];
                   } else {
                    usermsgfun(res);
                   }  
           }
       })
    }
    function savemember(){
        var hiddenbox = document.getElementById('userid2');
        var userid2 = hiddenbox.value;
        $.ajax({
            url: "/1/mlm",
            type: 'POST',
            data: {
                action: 'savemember',
                refrenceid:  $("#refrenceno").val(),
                membername1: $("#membername1").val(),
                memberemail: $("#memberemail").val(),
                bankname: $("#bankname").val(),
                ifsccode: $("#ifsccode").val(),
                bankaccountno: $("#bankaccountno").val(),
                membernumber: $("#membernumber1").val(),
                showplan: $("#showplan").val(),
                invoiceno: $("#invoiceno").val(),
                refrencename:$("#refrencename").val(),
                refrenceemail:$("#refrenceemail").val(),
                refrenceno:$("#refrenceno").val(),
                amount:$("#amount").val(),
                userid2:userid2
            },
            cache: false,
            success: function user(res) {
                if (res === 'sessionexpired') {
                    alert("Session Expired, Please login Again");
                    window.location.replace("/1/login");
                } else {
                    if (res === 'Information saved successfully') {
                        usermsgfun (" Information saved successfully ");
                        // refrenceno.value = '';
                        // membername1.value = '';
                        // memberemail.value = '';
                        // bankname.value = '';
                        // ifsccode.value = '';
                        // bankaccountno.value = '';
                        // // membernumber1.value = '';
                        // showplan.value = '';
                        // invoiceno.value = '';
                        // refrencename.value = '';
                        // refrenceno.value = '';
                        // refrenceemail.value = '';
                        // amount.value = '';
                        showmemberreport();
                    } else {
                        usermsgfun(res);
                    }
                   }
            }
        })
    }
    function clearmanagememberpage(){
         refrenceno.value = '';
        membername1.value = '';
        memberemail.value = '';
        bankname.value = '';
        ifsccode.value = '';
        bankaccountno.value = '';
        membernumber1.value = '';
        showplan.value = '';
        invoiceno.value = '';
        refrencename.value = '';
        refrenceno.value = '';
        refrenceemail.value = '';
        amount.value = '';  
        document.getElementById("imagepreview").innerHTML = ""
    }

    function uploadprofilepic(){
        // alert("hello")
    var uploadimg = document.getElementById("uploadselfie");
    var uploaddata=uploadimg.value;
    if(!uploadimg.files[0]){
        return usermsgfun("Please select file first");
    }
        var hiddenbox = document.getElementById('userid3');
        var userid3 = hiddenbox.value;
        if($("#userid3").val()===''){
            return alert("Please Search user first")
        }
    
    var size = uploadimg.files[0].size / 1024 /1024;  
   
    var fileext = uploaddata.split(".").pop();
    if(fileext !== 'jpg' && fileext !== 'png' && fileext !== 'jpeg' ){
        return usermsgfun("please select 'jpg' image extention")
    }
    if(size > 1){
        return usermsgfun("please select file less than 1 mb");
    }
        var filestore = uploadimg.files[0];
        var formdata = new FormData();
        formdata.append('image',filestore);
        formdata.append('action','savefile');
        fetch('/1/fileoperations',{method: "POST", body: formdata}).then(response=>response.text()).then(data=>{
            $.ajax({
                url: "/1/mlm",
                type: 'POST',
                data: {
                    action: 'uploadprofilepic',
                    userid3:userid3
                },
                cache: false,
                success: function savecaller(res) {
                    if(res === 'sessionexpired'){
                        alert("Session Expired, Please login Again")
                        window.location.replace("/1/login")
                    }else{
                        if(res =='something went wrong please try after sometime.....'){
                            usermsgfun("Please Search Member First")
                        }else{
                            getprofilepicmlm();
                            usermsgfun(res)
                        } 
                    }
                    }
            })
        })
    }
    function getprofilepicmlm(){
        var hiddenbox = document.getElementById('userid3');
        var userid3 = hiddenbox.value;
        if($("#userid3").val()===''){
            return alert("Please Search user first")
        }
        $.ajax({
            url: "/1/mlm",
            type: 'POST',
            data: {
                action: 'getprofilepicmlm' ,
                userid3:userid3
            },
            cache: false,
            success: function user(res) {
                if(res === 'sessionexpired'){
                    alert("Session Expired, Please login Again")
                    window.location.replace("/1/login")
                }else{
                    if(res == 'error' || res =='No Image'){
                        document.getElementById("imagepreview").innerHTML = ""
                        res='';
                    }else{
                        $("#imagepreview").html("<img src='/getmlmprofilepic/" + res + "' style='width: 250px; height: 200px; margin-left: 2%;'>");
                    
                        // document.getElementById("imagepreview").innerHTML="<img src='/getmlmprofilepic/"+res+"'style='max-width:280px; max-height:200px;''>"
                    }
                }
            }
        })
    }

    function closemember(){
        document.getElementById("managem").style.display="none";
        document.getElementById("mainmenu").style.display="block";
    }
    function searcrefrence(){
        if($("#refrenceno").val()==='' ){
            alert("Please enter mobile number or name")
            return
       }
       $.ajax({
           url: "/1/mlm",
           type: 'POST',
           data: {
               action: 'searcrefrence',
               mobileno:$("#refrenceno").val(),
           },
           cache: false,
           success: function user(res) {
                   if (res === 'sessionexpired') {
                       alert("Session Expired, Please login Again");
                       window.location.replace("/1/login");
                   } else if (Array.isArray(res)) {
                       // User is registered, update HTML elements
                       document.getElementById("userid2").value = res[3];
                       document.getElementById("refrencename").value = res[1];
                       document.getElementById("refrenceemail").value = res[2];
                       showmemberreport();
                       //retriveplanname();
                   } else {
                       // User is not registered or another error occurred
                       usermsgfun(res);
                       userid2.value = '';
                       refrenceemail.value='';
                       refrencename.value='';
                       refrenceno.value='';
                   }  
           }
       })
    }
    function showmemberreport(){
        var planid = $("#showplan").val();
       var refrenceid=$("#userid2").val();
        
        $.ajax({
            url: "/1/mlm",
            type: 'POST',
            data: {
                action: 'showmemberreport', 
                planid:planid,
                refrenceid:refrenceid,
            },
            cache: false,
            success: function user(res) {
                if(res === 'sessionexpired'){
                    alert("Session Expired, Please login Again")
                    window.location.replace("/1/login")
                }else{
                    document.getElementById("showmemberrepot").innerHTML=res;   
                }  
            }
        })
    }
    
    function downloadmemberjoiningr(){
        const slipinterface = this.document.getElementById("showreportonmember");
            var opt = {
                margin: 0.2,
                filename: 'Member  Joining Report.pdf',
                image: { type: 'jpeg', quality: 0.80},
                html2canvas: { scale:  2},
                jsPDF: { unit: 'in', format: 'A4', orientation: 'p'}
            };
            html2pdf().from(slipinterface).set(opt).save();
        }
    
    
    function showmemreportinfo(){
        showmemberreport();   
    }
    function serchmember(){
        if($("#usermobilenumber").val()==='' ){
            alert("Please enter mobile number or name")
            return
       }
       $.ajax({
           url: "/1/mlm",
           type: 'POST',
           data: {
               action: 'serchmember',
               mobileno:$("#membernumber1").val(),
           },
           cache: false,
           success: function user(res) {
                   if (res === 'sessionexpired') {
                       alert("Session Expired, Please login Again");
                       window.location.replace("/1/login");
                   } else if (Array.isArray(res)) {
                       // User is registered, update HTML elements
                       document.getElementById("membername1").value = res[1];
                       document.getElementById("memberemail").value = res[2];
                       document.getElementById("userid3").value = res[3];
                       getprofilepicmlm();
                   } else {
                   
                       // User is not registered or another error occurred
                       usermsgfun(res);
                   }  
           }
       })
    }
  //multilevelmarketing main page 
  function retriveplanname2(){
    $.ajax({
        url:"/1/mlm",
        type: 'POST',
        data: {
            action: 'retriveplanname2',
        },
        cache: false,
        success: function savecaller(res) {
            var slsn1 = document.getElementById("showplan2")
            if(slsn1!=null){
                slsn1.length = 0
                slsn1[slsn1.length] = new Option('Plan Name')
                for (i = 0; i < res.length; i++) {
                    var myOption = document.createElement("option");
                    try{
                        var x=JSON.parse(res[i]);
                        myOption.text = x.planname;
                        myOption.value = x.planid;
                        slsn1.add(myOption);
                    }catch(err)
                    {   
                    }
                }
            }      
        }
    })
}
function showplaninformation(){
    var planid = $("#showplan2").val();
    $.ajax({
        url: "/1/mlm",
        type: 'POST',
        data: {
            action: 'showplaninformation', 
            planid:planid
        },
        cache: false,
        success: function user(res) {
            if(res === 'sessionexpired'){
                alert("Session Expired, Please login Again")
                window.location.replace("/1/login")
            }else{
                document.getElementById("showmemberinformation").innerHTML=res;   
            }   
        }
    })
}
function calculationopen(cmemberid){


}

//payuot

function payoutbutton() {
    var refrenceid = $("#userid2").val();
    if($("#userid2").val()==='' ){
        alert("Please enter refrence number first")
        return
   }
    var totalAmount = parseFloat(document.getElementById("totalamountid").innerText);
    document.getElementById("totalshare").value = totalAmount;
    document.getElementById("payuotinfo").style.display = "block";
    document.getElementById("favdialpayout").style.display = "block";
    showpayoutreportinfo();
    $.ajax({
        url: "/1/mlm",
        type: 'POST',
        data: {
            action: 'payouttotalamount',
            refrenceid: refrenceid,
        },
        cache: false,
        success: function user(res) {
            var payoutamount = parseFloat(res.payoutamount) || 0; // Convert to float if it's not already
            var totalAmount = parseFloat(document.getElementById("totalamountid").innerText) || 0;
            //  console.log(payoutamount +"-payoutamount")
            //  console.log(totalAmount +"-totalAmount")
            if (isNaN(payoutamount) || isNaN(totalAmount)) {
                alert("Invalid payout or total amount");
                return;
            }
        
            var resultAmount =  totalAmount - payoutamount;
           // console.log(resultAmount +" -resultAmount")
            $("#totalpayout").val(payoutamount);
            $("#balancePayout").val(resultAmount);
        }
    });
}


function totalshervalues1(totalshervalues) {
    
}
function closepayout(){
    document.getElementById("payuotinfo").style.display="none";
    document.getElementById("favdialpayout").style.display="none";
}
function searchpayourm(){
    var refrenceid=$("#userid2").val();
    $.ajax({
        url: "/1/mlm",
        type: 'POST',
        data: {
            action: 'searchpayourm',
            membernumber:$("#pmnumber").val(),
        },
        cache: false,
        success: function user(res) {
                if (res === 'sessionexpired') {
                    alert("Session Expired, Please login Again");
                    window.location.replace("/1/login");
                } else if (Array.isArray(res)) {
                    document.getElementById("pmmemberid").value = res[0];
                    document.getElementById("pmname").value = res[1];
                    document.getElementById("pmamount").value = res[2];
                } else {
                    usermsgfun(res);
                }  
        }
    })
}
function savememberpayout() {
    if ($("#payamount").val() === '') {
        usermsgfun("Please enter Amount ")
        return;
    }
    if ($("#payoutdate").val() === '') {
        usermsgfun("Please enter Date ")
        return;
    }

    var refrenceid = $("#userid2").val();
    var payamount = parseFloat($("#payamount").val()); // Convert to float for numerical operations
    var totalpayout = parseFloat($("#totalpayout").val()) || 0;
    var balancePayout = parseFloat($("#balancePayout").val()) || 0;

    // Adding payamount to totalpayout and subtracting it from balancePayout
    totalpayout += payamount;
    balancePayout -= payamount;
    $.ajax({
        url: "/1/mlm",
        type: 'POST',
        data: {
            action: 'savepayout',
            refrenceid: refrenceid,
            amount: payamount,
            payoutdate: $("#payoutdate").val(),
            totalshare: $("#totalshare").val(),
            totalpayout: totalpayout,
            balancePayout: balancePayout,
        },
        cache: false,
        success: function user(res) {
            if (res === 'sessionexpired') {
                alert("Session Expired, Please login Again")
                window.location.replace("/1/login")
            } else {
                if (res === 'Data inserted.') {
                    $("#payamount").val('');
                    // $("#totalshare").val(''); // Clear the input field
                    usermsgfun(" Status Save Successfully ")
                    showpayoutreportinfo();
                    payoutbutton();
                } else {
                    showpayoutreportinfo();
                    usermsgfun(res);
                }
            }
        }
    });
}

function showpayoutreportinfo(){
    var refrenceid=$("#userid2").val();
    $.ajax({
        url: "/1/mlm",
        type: 'POST',
        data: {
            action: 'showpayoutreportinfo', 
            refrenceid:refrenceid,
        },
        cache: false,
        success: function user(res) {             
                document.getElementById("showpayoutreport").innerHTML=res;   
            } 
        
    })
}

// member report

function memberreportinfo(){
    document.getElementById("mainmenu").style.display="none";
    document.getElementById("downloadpayoutreport").style.display="none";
    document.getElementById("downloadreport").style.display="none";
    document.getElementById("memberreportinformation").style.display="block";
    document.getElementById("uploadbcsv").style.display="none";
    var today = new Date();
    document.getElementById("fromdatereport").value = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
    document.getElementById("todatereport").value = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);    

}
function closemreport(){
    document.getElementById("mainmenu").style.display="block";
    document.getElementById("memberreportinformation").style.display="none";
}

function payoutreportsearch(){
    document.getElementById("downloadpayoutreport").style.display="block";
    document.getElementById("downloadreport").style.display="none";
    document.getElementById("uploadbcsv").style.display="none";
    $.ajax({
        url: "/1/mlm",
        type: 'POST',
        data: {
            action: 'memberreportsearch',
            membernumber: $("#membernumber").val(),
            fromdatereport: $("#fromdatereport").val(),
            todatereport: $("#todatereport").val(),
        },
        cache: false,
        success: function user(res) {
            document.getElementById("filterdatereportshow").innerHTML=res;   
        }
    });
}
function currontpayoitreport(){
    document.getElementById("downloadpayoutreport").style.display="none";
    document.getElementById("downloadreport").style.display="block";
    document.getElementById("uploadbcsv").style.display="block";
    $.ajax({
        url: "/1/mlm",
        type: 'POST',
        data: {
            action: 'currontpayoitreport',
            membernumber: $("#membernumber").val(),
            // fromdatereport: $("#fromdatereport").val(),
            // todatereport: $("#todatereport").val(),
        },
        cache: false,
        success: function user(res) {
            document.getElementById("filterdatereportshow").innerHTML=res;   
        }
    });
}
function downloadreport(){
    var table = document.getElementById("report");
    var rows =[];
    for(var i=0,row; row = table.rows[i];i++){
        column1 = row.cells[0].innerText;
        column2 = row.cells[1].innerText;
        column3 = row.cells[2].innerText;
        column4 = row.cells[3].innerText;
        column5 = row.cells[4].innerText;
        column6 = row.cells[5].innerText;
        column7 = row.cells[6].innerText;
        column8 = row.cells[7].innerText;
        rows.push(
            [
                column1,
                column2,
                column3,
                column4,
                column5,
                column6,
                column7,
                column8
             
            ]
        );
    }
    csvContent = "data:text/csv;charset=utf-8,";
    /* add the column delimiter as comma(,) and each row splitted by new line character (\n) */
    rows.forEach(function(rowArray){
        row = rowArray.join(",");
        csvContent += row + "\r\n";
    });
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Pending Payout Report.csv");
    document.body.appendChild(link);
    link.click();
}
function downloadpayoutreport(){
    const slipinterface = this.document.getElementById("downloadpr");
        var opt = {
            margin: 0.2,
            filename: 'PayOut Report.pdf',
            image: { type: 'jpeg', quality: 0.80},
            html2canvas: { scale:  2},
            jsPDF: { unit: 'in', format: 'A4', orientation: 'p'}
        };
        html2pdf().from(slipinterface).set(opt).save();
    }
function setmemberid(memberid) {
    var hiddenbox1 = document.getElementById('memberid');
    hiddenbox1.value = memberid;  
}
function payonpendingpayOut(memberid){
        document.getElementById("payinfo").style.display = "block";
        document.getElementById("favdialpay").style.display = "block";
        showpayoutr(memberid);
        $.ajax({
            url: "/1/mlm",
            type: 'POST',
            data: {
                action: 'retrivpayout',
                memberid:memberid,
                
            },
            cache: false,
            success: function(res) {
                if (res === 'sessionexpired') {
                    alert("Session Expired, Please login Again");
                    window.location.replace("/1/login");
                } else if (typeof res === 'object' && res !== null) {
                    // Update HTML elements with retrieved data
                    var tshare = parseFloat(res.totalshare) || 0;
                    // document.getElementById("totalsharepay").value = res.totalShare; // Assuming totalshare is intended for payamt
                    var payoutamount = parseFloat(res.totalAmount) || 0;
                    var resultAmount =  tshare - payoutamount;
                    // alert(resultAmount +" resultAmount")
                    // alert(tshare +" tshare")
                    // alert(payoutamount +" payoutamount")
                   

                    $("#totalsharepay").val(tshare);
                    $("#totalpay").val(payoutamount);
                    $("#balancePay").val(resultAmount);
                    $("#payamt").val(resultAmount);
                    // document.getElementById("totalsharepay").value = res.totalshare;
                    // document.getElementById("totalpay").value = res.totalAmount; // Assuming totalAmount is intended for totalpay
                    // document.getElementById("balancePay").value = resultAmount; // Assuming balance is intended for balancePay
              } else {
                
                        usermsgfun(res);
                    }  
            }
        })
    // }

}
function closepay(){
    currontpayoitreport();
    document.getElementById("payinfo").style.display = "none";
    document.getElementById("favdialpay").style.display = "none";
}
function showpayoutr(memberid){
    $.ajax({
        url: "/1/mlm",
        type: 'POST',
        data: {
            action: 'showpayoutreportinfo', 
            refrenceid:memberid,
        },
        cache: false,
        success: function user(res) {             
                document.getElementById("showpayoutr").innerHTML=res;   
            } 
        
    })
}


function savereportpayout(memberid) {
    var hiddenbox1 = document.getElementById('memberid');
    memberid = hiddenbox1.value 
    if ($("#payamt").val() === '') {
        alert("Please enter Amount ")
        return;
    }
    if ($("#paydata").val() === '') {
        alert("Please enter Date ")
        return;
    }
    var payamount = parseFloat($("#payamt").val()); 
    // var totalpayout = parseFloat($("#totalpay").val()) + payamount;
    var balancePayout = parseFloat($("#balancePay").val()) - payamount;
    var balancePayout = parseFloat($("#balancePay").val()) || 0;

    var totalpayout = parseFloat($("#totalpay").val()) || 0;
    totalpayout += payamount;
      balancePayout = balancePayout-payamount
    //  balancePayout-=payamount;
    
    $.ajax({
        url: "/1/mlm",
        type: 'POST',
        data: {
            action: 'savepayout',
            refrenceid: memberid,
            amount: payamount,
            payoutdate: $("#paydata").val(),
            totalshare: $("#totalsharepay").val(),
            totalpayout: totalpayout,
            balancePayout: balancePayout,
        },
        cache: false,
        success: function user(res) {
            if (res === 'sessionexpired') {
                alert("Session Expired, Please login Again")
                window.location.replace("/1/login")
            } else {
                if (res === 'Data inserted.') {
                    showpayoutr(memberid);
                    payonreportshow(memberid);
                    $("#payamount").val('');
                    // $("#totalshare").val(''); 
                    usermsgfun(" Information saved successfully ")
                    
                    
                   // payoutbutton();
                } else {
                    // showpayoutr(memberid);
                    usermsgfun(res);
                }
            }
        }
    });
}
function payonreportshow(memberid){
        document.getElementById("payinfo").style.display = "block";
        document.getElementById("favdialpay").style.display = "block";
        $.ajax({
            url: "/1/mlm",
            type: 'POST',
            data: {
                action: 'retrivpayout',
                memberid:memberid,
                
            },
            cache: false,
            success: function(res) {
                if (res === 'sessionexpired') {
                    alert("Session Expired, Please login Again");
                    window.location.replace("/1/login");
                } else if (typeof res === 'object' && res !== null) {
                    var tshare = parseFloat(res.totalshare) || 0;
                    var payoutamount = parseFloat(res.totalAmount) || 0;
                    var resultAmount =  tshare - payoutamount;
                    // console.log(resultAmount +" -resultAmount")
                    // console.log(tshare +" -tshare")
                    // console.log(payoutamount +" -payoutamount")
                

                    // $("#totalsharepay").val(tshare);
                    // alert(tshare)
                    $("#totalpay").val(payoutamount);
                    $("#balancePay").val(resultAmount);
                    $("#payamt").val(resultAmount);
                     } else {
                
                        usermsgfun(res);
                    }  
            }
        })
 }
function showpayouttable(){
    var hiddenbox1 = document.getElementById('memberid');
    memberid = hiddenbox1.value 
    $.ajax({
        url: "/1/mlm",
        type: 'POST',
        data: {
            action: 'showpayoutreportinfo', 
            refrenceid:memberid,
        },
        cache: false,
        success: function user(res) {              
                document.getElementById("showpayoutreport").innerHTML=res;   
            } 
        
    })
}

function fileuploadcsv() {
    let fileInput = document.getElementById("uploadbcsvf"); 
    var fileName = fileInput.value;
    if(!fileInput.files[0]){
        return usermsgfun("Please select file first")
    }
    const fileSize = fileInput.files[0].size / 1024 / 1024;
    
    const fileExtension = fileName.split(".").pop();
    if(fileExtension !=='csv'){
        return usermsgfun("Only 'csv' format is accepted");
    }
    else if(fileSize > 2){
        return usermsgfun("File size exceeded size limit of 2 MB")
    }
    var ans = confirm("Do You Want To Upload This Data?")
    if(ans == true) {
        let assignmentdoc = fileInput.files[0];
        let formData = new FormData();       
        formData.append("csv", assignmentdoc)
        fetch('/uploadbankcsv', {method: "POST", body: formData}).then(()=>{
            uploadbcsv();
        })
    }     
    }
    function uploadbcsv(){
        $.ajax({
            url:"/1/mlm",
            type: 'POST',
            data: { 
                action: 'uploadbcsv',
            },
            cache: false,
            success: function savecaller(result) {  
                if (result === "success") {
                    usermsgfun("File uploaded successfully");
                } else {
                    usermsgfun("File upload failed");
                }
            }
        })
        }

        //Account Status 
        function acountstatusmlm(){
            getaccountdetailsmlm();
            document.getElementById("mainmenu").style.display='none';
            document.getElementById("acountstatusinfo").style.display='block';
        }
        function cancelaccountstatuspagemlm(){
            document.getElementById("acountstatusinfo").style.display='none';
            document.getElementById("mainmenu").style.display='block'
        }
        function getaccountdetailsmlm(){
            $.ajax({
                url: "/1/mlm",
                type: 'POST',
                data: {
                    action: 'getaccountdetailsmlm',
                },
                cache: false,
                success: function user(res) {
                    if(res === 'sessionexpired'){
                        alert("Session Expired, Please login Again")
                        window.location.replace("/1/login")
                    }else{
                        if(res === "error"){
                            usermsgfun("Please check internet connection if the problem persists, contact us")
                        }else{
                            var stdate = new Date(res[2]);
                            var edate = new Date(res[3]);
                            edate = edate.getFullYear() + '-' + ('0' + (edate.getMonth() + 1)).slice(-2) + '-' + ('0' + edate.getDate()).slice(-2);
                            stdate = stdate.getFullYear() + '-' + ('0' + (stdate.getMonth() + 1)).slice(-2) + '-' + ('0' + stdate.getDate()).slice(-2);
                            document.getElementById("state").value = res[0];
                            document.getElementById("valid").value = res[1];
                            document.getElementById("stdate").value = stdate;
                            document.getElementById("eddate").value = edate;    
                           // document.getElementById("usedquota").value = res[4]+"MB";
                        }
                    }       
                }
            })
        }
    //mlmtrees
   function mlmtreepage(){
    document.getElementById("mlmtreeinformation").style.display='block';
    document.getElementById("mainmenu").style.display='none';
   }
   function showansmemberlevel(){
    $.ajax({
        url: "/1/mlm",
        type: 'POST',
        data: {
            action: 'showansmemberlevel',
            searchmemberlevel: $("#searchmemberlevel").val(),
        },
        cache: false,
        success: function user(res) {
            if (res === 'sessionexpired') {
                alert("Session Expired, Please login Again")
                window.location.replace("/1/login")
            }else{
               if(res) {
                document.getElementById("showmembereportree").innerHTML=res;   
               }else{
                usermsgfun(res)
               }
            }

        }
    });
   }
   //tree
   function closemlmtree(){
    document.getElementById("mlmtreeinformation").style.display='none';
    document.getElementById("mainmenu").style.display='block';
   }