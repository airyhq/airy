package co.airy.core.api.auth.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class Mail {
    private final String mailFrom;
    private final JavaMailSender emailSender;

    Mail(@Value("${mail.sender.from}") String mailFrom, JavaMailSender emailSender) {
        this.mailFrom = mailFrom;
        this.emailSender = emailSender;
    }

    public void send(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(mailFrom);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        emailSender.send(message);
    }
}
