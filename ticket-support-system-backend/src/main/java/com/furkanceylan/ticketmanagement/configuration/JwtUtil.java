package com.furkanceylan.ticketmanagement.configuration;

import com.furkanceylan.ticketmanagement.entity.User;
import com.furkanceylan.ticketmanagement.service.UserDetailsServiceImpl;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
public class JwtUtil {

  @Value("${jwt.secret}")
  private String secret;
  @Value("${jwt.expiration}")
  private Long expiration;

  public String extractUsername(String token) {
    return extractClaim(token, Claims::getSubject);
  }

  public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
    final Claims claims = extractAllClaims(token);
    return claimsResolver.apply(claims);
  }

  private Claims extractAllClaims(String token) {
    return Jwts.parserBuilder()
        .setSigningKey(getSigningKey())
        .build()
        .parseClaimsJws(token)
        .getBody();
  }

  public String generateToken(Authentication authentication) {
    User userPrincipal = (User) authentication.getPrincipal();

    Date now = new Date();
    Date expiryDate = new Date(now.getTime() + expiration);

    Map<String, Object> claims = new HashMap<>();
    claims.put("role", userPrincipal.getRole());

    return Jwts.builder()
        .setClaims(claims)
        .setSubject(userPrincipal.getUsername())
        .setIssuedAt(now)
        .setExpiration(expiryDate)
        .signWith(getSigningKey(), SignatureAlgorithm.HS512)
        .compact();
  }

  public boolean isTokenValid(String token, UserDetails userDetails) {
    final String username = extractUsername(token);
    return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
  }

  private boolean isTokenExpired(String token) {
    return extractExpiration(token).before(new Date());
  }

  private Date extractExpiration(String token) {
    return extractClaim(token, Claims::getExpiration);
  }

  private SecretKey getSigningKey() {
    byte[] keyBytes = Base64.getDecoder().decode(secret);
    return Keys.hmacShaKeyFor(keyBytes);
  }
}
