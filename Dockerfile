# Use the MongoDB image
FROM mongo

# Copy the database dump into the Docker image
COPY ./test_data /dump

# Restore the database dump to the MongoDB server
CMD mongorestore /dump
