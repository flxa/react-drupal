FROM previousnext/php-apache:7.2-3.x-dev as build
ADD . /data
RUN make init styleguide
RUN rm -fR node_modules

FROM previousnext/php-apache:7.2-3.x
COPY --from=build /data /data
RUN chown -R apache:apache /data
