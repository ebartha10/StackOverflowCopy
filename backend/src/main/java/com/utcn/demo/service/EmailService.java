package com.utcn.demo.service;

import com.sendgrid.*;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import com.sendgrid.helpers.mail.objects.Personalization;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class EmailService {
    @Value("${MAILERSEND_API_KEY}")
    private String mailerSendApiKey;

    @Value("${MAILERSEND_FROM_EMAIL}")
    private String fromEmail;

    @Value("${SENDGRID_API_KEY}")
    private String sendgridApiKey;
    private static final String BAN_TEMPLATE_ID = "351ndgwojr54zqx8";

    public EmailService() {

    }

    public void sendBanNotification(String userEmail, String userName) {
        Email from = new Email("emericbartha@gmail.com");
        String subject = "You have been banned from StackOverflow Clone";
        Email to = new Email(userEmail);
        String templateId = "d-e67d5a773bf548169b94d9b7b46391fa"; // Replace with your template ID

        // Create a personalization object for dynamic data
        Personalization personalization = new Personalization();
        personalization.addTo(to);
        Map<String, String> dynamicTemplateData = new HashMap<>();
        dynamicTemplateData.put("date", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        dynamicTemplateData.put("user", userName);
        personalization.addDynamicTemplateData("dynamic_template_data", dynamicTemplateData);

        // Create the mail object
        Mail mail = new Mail(from,  subject, to, new Content("text/plain", "You have been banned!"));
        mail.setTemplateId(templateId);
        mail.addPersonalization(personalization);
        mail.setSubject(subject);



        SendGrid sg = new SendGrid(sendgridApiKey);
        Request request = new Request();
        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            Response response = sg.api(request);
            System.out.println(response.getStatusCode());
            System.out.println(response.getBody());
            System.out.println(response.getHeaders());
        } catch (IOException ex) {
            throw new RuntimeException("Error sending email", ex);
        }

    }

} 