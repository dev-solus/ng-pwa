#!groovy
node {
  def apps = [
    [name: "mi-lune", port: '4000', exposed_port: '', path: '', domaine: "mi-lune.dev-solus.com"],
  ];

  def app

  stage('Initialize'){
      def dockerHome = tool 'myDocker'
      env.PATH = "${dockerHome}/bin:${env.PATH}"
    }

  stage('Cloning Git') {
    def commit = checkout scm

    def currentCommit = commit.GIT_COMMIT // sh(script: "git rev-parse HEAD", returnStdout: true).trim()
    def lastCommit = commit.GIT_PREVIOUS_SUCCESSFUL_COMMIT

    lastCommit = lastCommit == null || lastCommit.trim() == '' ? 'HEAD^' : lastCommit

    def command = "git diff-tree -r --name-only ${currentCommit} ${lastCommit}"

    def changes0 = sh(script: command, returnStdout: true).trim()

    println("----------------------------------> ${changes0}")

    apps.each { e ->

      if(!lastCommit) {
        echo "First commit building ${e.name} ..."
        return
      }

      def changes = sh(script: "${command} -- ./", returnStdout: true).trim()

      println("***********************> ${changes}")

      // if (!changes) {
      //   echo "No changes in the folder ${e.name}."
      //   return
      // }

      // echo "Changes found in the folder ${e.name}:"
      // echo "${changes}"

      app = docker.build("${e.name}", "-t ${e.name} -f ./Dockerfile ./${e.path}")
      // sh """docker build -t sa-dev-api-cms -f ./cmsApi/Dockerfile ./"""
      //  --volume /home/dev/volumes/${e.name}/wwwroot:/app/wwwroot \

      script{
        try{
            sh "docker rm --force ${e.name}"
        }catch(Exception ex)
        {
          echo 'Exception occurred: ' + ex.toString()
        }
      }

      if (e.exposed_port == "") {
         sh """docker run -d \
          --restart unless-stopped \
          --network proxy \
          --label traefik.enable=true \
          --label traefik.http.routers.${e.name}.tls=true \
          --label traefik.http.routers.${e.name}.tls.certresolver=letsencrypt \
          --label traefik.http.routers.${e.name}.rule='Host(`${e.domaine}`) '\
          --label traefik.http.services.${e.name}.loadbalancer.server.port=${e.port} \
          --name ${e.name} \
          ${e.name}"""
      } else {
         sh """docker run -d \
          --restart unless-stopped \
          --publish ${e.exposed_port}:${e.port} \
          --name ${e.name} \
          ${e.name}"""
      }

      sh "docker rmi --force ${e.name}"
    }
  }
}
