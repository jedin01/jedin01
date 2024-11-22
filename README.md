### Me, myself & i
```java
import java.util.ArrayList;
import java.util.List;

public class AbnerLourenco {
    public static void main(String[] args) {
        // Criação do banner
        String nome = "Abner Lourenço";
        String profissao = "Desenvolvedor Fullstack";
        String mensagem = "Apaixonado por Tecnologia e Inovação";

        printBanner(nome, profissao, mensagem);

        // Tecnologias em destaque
        List<String> tecnologias = List.of(
            "HTML", "CSS", "JavaScript", "PHP", "Laravel", 
            "Java", "JSP", "SQL", "MySQL", "React", 
            "C#", "Git", "Spring Boot"
        );

        System.out.println("\n💻 Tecnologias que domino:");
        tecnologias.forEach(tech -> System.out.println("- " + tech));
        
        System.out.println("\n🌟 Sempre em busca de aprender e crescer!");
    }

    private static void printBanner(String nome, String profissao, String mensagem) {
        String border = "*".repeat(mensagem.length() + 4);
        System.out.println(border);
        System.out.printf("* %s *%n", mensagem);
        System.out.println(border);
        System.out.printf("👨‍💻 Nome: %s%n", nome);
        System.out.printf("🚀 Profissão: %s%n", profissao);
    }
}




![HTML](https://img.shields.io/badge/-HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/-CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![PHP](https://img.shields.io/badge/-PHP-777BB4?style=flat-square&logo=php&logoColor=white)
![Laravel](https://img.shields.io/badge/-Laravel-FF2D20?style=flat-square&logo=laravel&logoColor=white)
![Java](https://img.shields.io/badge/-Java-007396?style=flat-square&logo=java&logoColor=white)
![JSP](https://img.shields.io/badge/-JSP-007396?style=flat-square&logo=java&logoColor=white)
![SQL](https://img.shields.io/badge/-SQL-4479A1?style=flat-square&logo=mysql&logoColor=white)
![MySQL](https://img.shields.io/badge/-MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white)
![React](https://img.shields.io/badge/-React-61DAFB?style=flat-square&logo=react&logoColor=black)
![C#](https://img.shields.io/badge/-C%23-239120?style=flat-square&logo=c-sharp&logoColor=white)
![Git](https://img.shields.io/badge/-Git-F05032?style=flat-square&logo=git&logoColor=white)
![Spring Boot](https://img.shields.io/badge/-Spring%20Boot-6DB33F?style=flat-square&logo=spring-boot&logoColor=white)
