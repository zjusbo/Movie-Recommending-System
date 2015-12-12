<?php
  $query = $_GET["query"];
  if($query == null){
    //return movie list
    $movie_list = movie_ls();
    $picked_list = array();
    $picked_idx = array();
    for($i = 0; $i < 10; $i++){
      $index = rand(0, count($movie_list));
      // remove duplicate
      while(in_array($index, $picked_idx)){
        $index = rand(0, count($movie_list));
      } 
      array_push($picked_idx, $index);
      array_push($picked_list, $movie_list[$index]);
    }
    echo json_encode(array("Movie"=>$picked_list));
  } 
  else{
    // rating array got, call predict function
    $rating_array = json_decode($query, true);
    if($rating_array == null){
      echo "failed to parse json string.";
      echo "<br>";
      echo $query;
      return ;
    }
    if($rating_array[0] == null or $rating_array[0]['id'] == null or $rating_array[0]['rating'] == null){
      echo "json should be an array, each element of the array should contain key \"id\" and key \"rating\"";
      return ;
    }
    $predict_array = predict($rating_array);
    $predict_array = array("Movie" => $predict_array);
    $json = json_encode($predict_array);
    echo $json;
  }

  function movie_ls(){
    // return movie list
    // return array ("id" => "movie_string")
   $file = fopen("movie_ids.txt", "r") or die("Unable to open movie_ids.txt");
   $ans = array();
   while(!feof($file)){
     $line = fgets($file);
     $row = preg_split("/ /", $line, 2);
     $row[1] = rtrim($row[1], "\n");
     $item = array("id" => $row[0], "title" => $row[1]);
     if($item['id'] == "") continue;
     array_push($ans, $item);
   }
   return $ans;
  }

  function predict($my_ratings){
    $inputfile = fopen("input", "w") or die ("Unable to create file!");
    foreach($my_ratings as $key => $value){
      $line = $value["id"] . " " . $value["rating"] . "\n";
      fwrite($inputfile, $line);
    }
    // write calling argument to file
    fclose($inputfile);
    $cmd = "octave -qf main.m";

    // call octave
    exec($cmd);

    // read return vaule from file
    $outputfile = fopen("output", "r") or die("Unable to open output file");
    $ans = array();
    while(!feof($outputfile)) {
      $line = fgets($outputfile);
      $row = preg_split("/[\t]+/", $line);
      $row[2] = rtrim($row[2], "\n");
      $item = array("id" => $row[0], "rating" => $row[1] / 2, "title" => $row[2]);
      if($item['id'] == "") continue;
      array_push($ans, $item);
    }
    return $ans;
  }
?>

