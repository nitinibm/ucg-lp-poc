docker build --no-cache -t jgothan/node_watson_lp .
docker run -h lp_watson --name lp_watson  -d jgothan/node_watson_lp
containerID=$(docker ps -a --filter "name=lp_watson" | awk '{ print $1}')
docker logs -f $containerID