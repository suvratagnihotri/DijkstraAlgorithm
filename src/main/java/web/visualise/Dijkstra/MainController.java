package web.visualise.Dijkstra;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MainController {
    
    @GetMapping("/")
    public String getMainPage(){
        return "main";
    }

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/resume.{username}")
    @SendTo("/start/initial.{username}")
    public void chat(String msg, @DestinationVariable String username, SimpMessageHeaderAccessor headerAccessor) {
        System.out.println(msg);
        JSONObject jsonObject = new JSONObject(msg);
        String chatData = jsonObject.getString("chat");
        System.out.println(chatData);
        messagingTemplate.convertAndSend("/start/initial."+username,jsonObject.append("gameresult", "winner").toString());
    }

    @MessageMapping("/adduser.{username}") 
    @SendTo("/start/initial.{username}")
    public void addUser(String chatMessage, @DestinationVariable String username, SimpMessageHeaderAccessor headerAccessor) {
        // System.out.println(chatMessage);
        JSONObject jsonObject = new JSONObject(chatMessage);
        System.out.println(jsonObject);
        messagingTemplate.convertAndSend("/start/initial."+username,chatMessage);
    }
}
