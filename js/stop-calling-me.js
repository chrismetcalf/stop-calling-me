$(function() {
  $("#search").submit(function(event) {
    event.preventDefault();
    var number = $("#search .query").val();

    // Clean up our number
    number = number
      .replace(/[^0-9]/g, '')
      .replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');

    // Grab our current location and fetch nearby restaurants
    $.ajax({
      url: "https://opendata.fcc.gov/resource/sr6c-syda.json",
      type: "GET",
      data: {
        "caller_id_number" : number,
        "$where" : "issue IN ('Telemarketing (including do not call and spoofing)', 'Robocalls', 'Junk Faxes')",
        "$select" : "caller_id_number, COUNT(*) AS count, MAX(issue_date) AS last_reported",
        "$group" : "caller_id_number",
        "$$app_token": "VNyBRMoJAPyaGMUC42IY2M1UA"
      }
    }).done(function(calls) {
      if(calls.length > 0) {
        $("#results").text("There have been " + calls[0].count + " complaint(s) about this number, most recently at " + (new Date(calls[0].last_reported)).toLocaleString());
      } else {
        $("#results").text("No complaints yet for this number...");
      }
    });
  });
});

